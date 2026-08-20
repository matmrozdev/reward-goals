import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApplication } from '../src/app.bootstrap';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearTestDatabase } from './test-database';

jest.setTimeout(30_000);

describe('Authentication API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const credentials = {
    email: 'person@example.com',
    password: 'correct horse battery staple',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await clearTestDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows browser clients to call the API across origins', async () => {
    await request(app.getHttpServer())
      .options('/auth/login')
      .set('Origin', 'http://localhost:8081')
      .set('Access-Control-Request-Method', 'POST')
      .expect(204)
      .expect('Access-Control-Allow-Origin', '*');
  });

  it('registers a normalized user without exposing password data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...credentials, email: '  Person@Example.COM ' })
      .expect(201);

    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        email: credentials.email,
        createdAt: expect.any(String),
      },
    });
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);

    const storedUser = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    expect(storedUser?.passwordHash).not.toBe(credentials.password);
  });

  it('rejects duplicate normalized emails with a conflict', async () => {
    await register();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...credentials, email: 'PERSON@example.com' })
      .expect(409);
  });

  it('returns clear validation failures and rejects unknown properties', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'invalid', password: 'short', admin: true })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/email/),
        expect.stringMatching(/password/),
        expect.stringMatching(/admin/),
      ]),
    );
  });

  it('logs in and protects the current-user endpoint with an access token', async () => {
    await register();
    const loginResponse = await login();

    expect(loginResponse.body).toEqual({
      user: {
        id: expect.any(String),
        email: credentials.email,
        createdAt: expect.any(String),
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(JSON.stringify(loginResponse.body)).not.toMatch(/password/i);

    const meResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);
    expect(meResponse.body).toEqual({ user: loginResponse.body.user });
  });

  it.each([
    ['unknown email', 'unknown@example.com', credentials.password],
    ['invalid password', credentials.email, 'incorrect password'],
  ])(
    'uses an identical unauthorized response for %s',
    async (_case, email, password) => {
      await register();

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    },
  );

  it('rejects missing, malformed, expired, and refresh tokens on access routes', async () => {
    await register();
    const loginResponse = await login();
    const expiredAccessToken = await new JwtService().signAsync(
      { sub: loginResponse.body.user.id, type: 'access' },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: -1,
      },
    );

    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer malformed')
      .expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${expiredAccessToken}`)
      .expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.refreshToken}`)
      .expect(401);
  });

  it('rotates refresh tokens and rejects replay of the consumed token', async () => {
    await register();
    const loginResponse = await login();
    const firstRefreshToken = loginResponse.body.refreshToken;

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: firstRefreshToken })
      .expect(200);
    expect(refreshResponse.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(refreshResponse.body.refreshToken).not.toBe(firstRefreshToken);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: firstRefreshToken })
      .expect(401);
  });

  it('allows exactly one concurrent refresh-token consumer', async () => {
    await register();
    const loginResponse = await login();
    const refreshToken = loginResponse.body.refreshToken;

    const responses = await Promise.all([
      request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken }),
      request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken }),
    ]);

    expect(responses.map(({ status }) => status).sort()).toEqual([200, 401]);
  });

  it('rejects malformed, expired, and wrong-token-type refresh values', async () => {
    await register();
    const loginResponse = await login();
    const expiredRefreshToken = await new JwtService().signAsync(
      { sub: loginResponse.body.user.id, type: 'refresh' },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: -1,
        jwtid: '8b5a4c75-05d7-4284-8a87-2dc0f5ae465a',
      },
    );

    for (const refreshToken of [
      'malformed',
      expiredRefreshToken,
      loginResponse.body.accessToken,
    ]) {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    }
  });

  it('revokes the refresh session on logout', async () => {
    await register();
    const loginResponse = await login();
    const refreshToken = loginResponse.body.refreshToken;

    await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ refreshToken })
      .expect(204);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });

  async function register() {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);
  }

  async function login() {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200);
  }
});

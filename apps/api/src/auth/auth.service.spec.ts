import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { AuthService, normalizeEmail } from './auth.service';

describe('AuthService', () => {
  const publicUser = {
    id: '3dbb1310-59c7-47f6-b22b-bc5ec7185a5a',
    email: 'person@example.com',
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
  };
  const storedUser = { ...publicUser, passwordHash: 'stored-password-hash' };

  function createService() {
    const transaction = {
      refreshSession: {
        create: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const prisma = {
      user: {
        create: jest.fn().mockResolvedValue(publicUser),
        findUnique: jest.fn().mockResolvedValue(storedUser),
      },
      refreshSession: {
        create: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: jest.fn(async (callback) => callback(transaction)),
    };
    const passwordService = {
      hash: jest.fn().mockResolvedValue('new-password-hash'),
      verify: jest.fn().mockResolvedValue(true),
    };
    const tokenService = {
      issuePair: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshState: {
          id: '93bc5d36-228b-47ea-86a1-56a752814706',
          tokenHash: 'refresh-token-hash',
          expiresAt: new Date('2026-09-20T10:00:00.000Z'),
        },
      }),
      verifyRefreshToken: jest.fn().mockResolvedValue({
        sub: publicUser.id,
        type: 'refresh',
        jti: '93bc5d36-228b-47ea-86a1-56a752814706',
      }),
      hashRefreshToken: jest.fn().mockReturnValue('refresh-token-hash'),
    };

    return {
      prisma,
      passwordService,
      tokenService,
      transaction,
      service: new AuthService(
        prisma as never,
        passwordService as never,
        tokenService as never,
      ),
    };
  }

  it('normalizes email and persists only the password hash on registration', async () => {
    const { service, prisma, passwordService } = createService();

    await expect(
      service.register({
        email: '  Person@Example.COM ',
        password: 'plain-password',
      }),
    ).resolves.toEqual(publicUser);
    expect(passwordService.hash).toHaveBeenCalledWith('plain-password');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'person@example.com',
        passwordHash: 'new-password-hash',
      },
      select: { id: true, email: true, createdAt: true },
    });
    expect(JSON.stringify(prisma.user.create.mock.calls)).not.toContain(
      'plain-password',
    );
  });

  it('maps the database uniqueness guarantee to a conflict response', async () => {
    const { service, prisma } = createService();
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate email', {
        code: 'P2002',
        clientVersion: '7.9.1',
      }),
    );

    await expect(
      service.register({ email: publicUser.email, password: 'password' }),
    ).rejects.toEqual(
      new ConflictException('An account with this email already exists'),
    );
  });

  it.each([
    ['unknown email', null, true],
    ['invalid password', storedUser, false],
  ])('uses the generic login failure for %s', async (_case, user, isValid) => {
    const { service, prisma, passwordService } = createService();
    prisma.user.findUnique.mockResolvedValue(user);
    passwordService.verify.mockResolvedValue(isValid);

    await expect(
      service.login({ email: publicUser.email, password: 'password' }),
    ).rejects.toEqual(new UnauthorizedException('Invalid email or password'));
  });

  it('returns public user data and persists only refresh-token state on login', async () => {
    const { service, prisma } = createService();

    const result = await service.login({
      email: publicUser.email,
      password: 'password',
    });

    expect(result).toEqual({
      user: publicUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(prisma.refreshSession.create).toHaveBeenCalledWith({
      data: {
        id: '93bc5d36-228b-47ea-86a1-56a752814706',
        tokenHash: 'refresh-token-hash',
        expiresAt: new Date('2026-09-20T10:00:00.000Z'),
        userId: publicUser.id,
      },
    });
    expect(
      JSON.stringify(prisma.refreshSession.create.mock.calls),
    ).not.toContain('refresh-token"');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('atomically consumes the prior refresh session before creating its replacement', async () => {
    const { service, transaction } = createService();

    await expect(
      service.refresh({ refreshToken: 'old-refresh-token' }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(transaction.refreshSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          revokedAt: null,
          tokenHash: 'refresh-token-hash',
        }),
      }),
    );
    expect(transaction.refreshSession.create).toHaveBeenCalledTimes(1);
  });

  it('rejects replay when the prior refresh session was already consumed', async () => {
    const { service, transaction } = createService();
    transaction.refreshSession.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.refresh({ refreshToken: 'replayed-refresh-token' }),
    ).rejects.toEqual(new UnauthorizedException('Invalid refresh token'));
    expect(transaction.refreshSession.create).not.toHaveBeenCalled();
  });

  it('does not return replacement tokens when the rotation transaction fails', async () => {
    const { service, prisma } = createService();
    prisma.$transaction.mockRejectedValue(new Error('transaction failed'));

    await expect(
      service.refresh({ refreshToken: 'old-refresh-token' }),
    ).rejects.toThrow('transaction failed');
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases email addresses', () => {
    expect(normalizeEmail('  Person@Example.COM ')).toBe('person@example.com');
  });
});

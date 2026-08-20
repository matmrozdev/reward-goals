import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import type { ApiEnvironment } from '../config/environment';
import { TokenService } from './token.service';

describe('TokenService', () => {
  const environment: ApiEnvironment = {
    nodeEnv: 'test',
    host: '127.0.0.1',
    port: 3001,
    databaseUrl: 'postgresql://localhost/reward_goals_test',
    accessTokenSecret: 'unit-test-access-secret',
    accessTokenTtlSeconds: 900,
    refreshTokenSecret: 'unit-test-refresh-secret',
    refreshTokenTtlSeconds: 2592000,
  };
  const jwtService = new JwtService();
  const service = new TokenService(jwtService, environment);

  it('issues independently typed access and refresh tokens', async () => {
    const result = await service.issuePair('user-id');
    const accessPayload = await jwtService.verifyAsync(result.accessToken, {
      secret: environment.accessTokenSecret,
    });
    const refreshPayload = await jwtService.verifyAsync(result.refreshToken, {
      secret: environment.refreshTokenSecret,
    });

    expect(accessPayload).toMatchObject({ sub: 'user-id', type: 'access' });
    expect(refreshPayload).toMatchObject({
      sub: 'user-id',
      type: 'refresh',
      jti: result.refreshState.id,
    });
    expect(result.refreshState.tokenHash).not.toContain(result.refreshToken);
  });

  it('rejects an access token at the refresh boundary', async () => {
    const result = await service.issuePair('user-id');

    await expect(
      service.verifyRefreshToken(result.accessToken),
    ).rejects.toEqual(new UnauthorizedException('Invalid refresh token'));
  });

  it('produces a deterministic digest without retaining token material', () => {
    const first = service.hashRefreshToken('refresh-token');
    const second = service.hashRefreshToken('refresh-token');

    expect(first).toBe(second);
    expect(first).not.toContain('refresh-token');
    expect(first).toHaveLength(64);
  });
});

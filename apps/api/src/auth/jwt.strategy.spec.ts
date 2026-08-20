import { UnauthorizedException } from '@nestjs/common';
import type { ApiEnvironment } from '../config/environment';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const environment = {
    accessTokenSecret: 'access-secret',
  } as ApiEnvironment;
  const strategy = new JwtStrategy(environment);

  it('maps a valid access-token subject to an authenticated principal', () => {
    expect(strategy.validate({ sub: 'user-id', type: 'access' })).toEqual({
      id: 'user-id',
    });
  });

  it('rejects a refresh token at the access boundary', () => {
    expect(() =>
      strategy.validate({ sub: 'user-id', type: 'refresh' }),
    ).toThrow(new UnauthorizedException('Invalid access token'));
  });
});

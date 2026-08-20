import { createHash, randomUUID } from 'node:crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { API_ENVIRONMENT } from '../config/environment.module';
import type { ApiEnvironment } from '../config/environment';
import {
  type IssuedTokenPair,
  type JwtTokenPayload,
  tokenTypes,
} from './auth.types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(API_ENVIRONMENT)
    private readonly environment: ApiEnvironment,
  ) {}

  async issuePair(userId: string): Promise<IssuedTokenPair> {
    const refreshId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, type: tokenTypes.access },
        {
          secret: this.environment.accessTokenSecret,
          expiresIn: this.environment.accessTokenTtlSeconds,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, type: tokenTypes.refresh },
        {
          secret: this.environment.refreshTokenSecret,
          expiresIn: this.environment.refreshTokenTtlSeconds,
          jwtid: refreshId,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshState: {
        id: refreshId,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: new Date(
          Date.now() + this.environment.refreshTokenTtlSeconds * 1_000,
        ),
      },
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        refreshToken,
        { secret: this.environment.refreshTokenSecret },
      );

      if (payload.type !== tokenTypes.refresh || !payload.sub || !payload.jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }
}

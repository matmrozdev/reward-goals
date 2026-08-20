import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ApiEnvironment } from '../config/environment';
import { API_ENVIRONMENT } from '../config/environment.module';
import {
  type AuthenticatedUser,
  type JwtTokenPayload,
  tokenTypes,
} from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(API_ENVIRONMENT) environment: ApiEnvironment) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.accessTokenSecret,
    });
  }

  validate(payload: JwtTokenPayload): AuthenticatedUser {
    if (payload.type !== tokenTypes.access || !payload.sub) {
      throw new UnauthorizedException('Invalid access token');
    }

    return { id: payload.sub };
  }
}

export const tokenTypes = {
  access: 'access',
  refresh: 'refresh',
} as const;

export interface AuthenticatedUser {
  id: string;
}

export interface JwtTokenPayload {
  sub: string;
  type: (typeof tokenTypes)[keyof typeof tokenTypes];
  jti?: string;
  exp?: number;
}

export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenState {
  id: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IssuedTokenPair extends TokenPair {
  refreshState: RefreshTokenState;
}

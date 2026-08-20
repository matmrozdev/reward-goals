export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  user: AuthUser;
};

export interface JwtData {
  accessToken: string;
  refreshToken: string;
  anonymous: boolean;
  accessTokenExpiresAt: string;
}

export interface JwtPayload {
  id: string;
  anonymous: boolean;
  tokenType: 'access' | 'refresh';
}

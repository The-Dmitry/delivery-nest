export interface JwtData {
  accessToken: string;
  refreshToken: string;
  anonymous: boolean;
}

export interface JwtPayload {
  id: string;
  anonymous: boolean;
  tokenType: 'access' | 'refresh';
}

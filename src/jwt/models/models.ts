export interface JwtPayload {
  id: string;
  anonymous: boolean;
  tokenType: 'access' | 'refresh';
}

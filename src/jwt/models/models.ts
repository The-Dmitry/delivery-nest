import { Role } from 'generated/prisma';

export interface JwtPayload {
  id: string;
  anonymous: boolean;
  tokenType: 'access' | 'refresh';
  role: Role;
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService) {}

  get postgresUser(): string {
    return this.config.getOrThrow<string>('POSTGRES_USER');
  }

  get postgresPassword(): string {
    return this.config.getOrThrow<string>('POSTGRES_PASSWORD');
  }

  get postgresDb(): string {
    return this.config.getOrThrow<string>('POSTGRES_DB');
  }

  get jwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  get databaseUrl(): string {
    return this.config.getOrThrow<string>('DATABASE_URL');
  }

  get accessTokenExpiration(): number {
    return this.config.getOrThrow<number>('ACCESS_TOKEN_EXPIRATION');
  }
}

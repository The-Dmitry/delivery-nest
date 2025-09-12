import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// UNSAFE GUARD. USE FOR LOGIN ONLY. ACCEPTS EXPIRED TOKEN
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    if (!authHeader) return true;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return true;

    try {
      req.user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: true,
      });
    } catch {
      req.user = undefined;
    }

    return true;
  }
}

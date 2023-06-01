import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredRole = 'admin';

    const token = request.headers.authorization;

    if (token) {
      try {
        const payload = jwt.verify(
          token,
          this.configService.get<string>('SECRET_KEY'),
        ) as {
          id: number;
          role: string;
        };

        if (payload.role === requiredRole) {
          return true; // User has the required role, allow access
        }
      } catch (error) {
        console.error(error);
        // Token verification failed
      }
    }

    return false; // User does not have the required role or token is missing, deny access
  }
}

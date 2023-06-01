import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (token) {
      try {
        const payload = jwt.verify(
          token,
          this.configService.get<string>('SECRET_KEY'),
        ) as JwtPayload;

        request.user = { id: payload.id }; // Set the user ID in the request object
        return true; // User has the required role, allow access
      } catch (error) {
        console.error(error);
        // Token verification failed
      }
    }

    return false; // User token is missing, deny access
  }
}

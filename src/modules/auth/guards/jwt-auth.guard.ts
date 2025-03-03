import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TJwtPayload } from '../types';

interface AuthenticatedRequest extends Request {
  user?: TJwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      request.user = this.jwtService.verify<TJwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return true;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

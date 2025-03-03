import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userService.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      return this.generateTokens(
        newUser.id,
        newUser.email,
        newUser.firstName,
        newUser.lastName,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
    );
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify<TJwtPayload>(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.getUserWithRefreshToken(payload.sub);
      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(
        user.id,
        user.email,
        user.firstName,
        user.lastName,
      );
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
    return { message: 'Logged out' };
  }

  private async generateTokens(
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
  ) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, firstName, lastName },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      },
    );

    await this.userService.update(userId, { refreshToken });

    return { accessToken, refreshToken };
  }
}

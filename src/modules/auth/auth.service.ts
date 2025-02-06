import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException, HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { TJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user: User = this.userRepository.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      await this.userRepository.save(user);
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async refreshToken(oldRefreshToken: string) {
    const payload = this.jwtService.verify<TJwtPayload>(oldRefreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out' };
  }

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      },
    );

    await this.userRepository.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }
}

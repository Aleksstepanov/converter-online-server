import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}

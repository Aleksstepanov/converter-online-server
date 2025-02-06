import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    body: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    },
  ) {
    return this.authService.register(
      body.email,
      body.firstName,
      body.lastName,
      body.password,
    );
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  logout(@Body() body: { userId: number }) {
    return this.authService.logout(body.userId);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { LogoutDto, LoginDto, RegisterDto, RefreshTokenDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    description: 'Register new user',
    type: RegisterDto,
  })
  @Post('register')
  register(
    @Body()
    body: RegisterDto,
  ) {
    return this.authService.register(
      body.email,
      body.firstName,
      body.lastName,
      body.password,
    );
  }

  @ApiBody({
    description: 'Login user',
    type: LoginDto,
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiBody({
    description: 'Refresh access token',
    type: RefreshTokenDto,
  })
  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @ApiBody({
    description: 'Logout user',
    type: LogoutDto,
  })
  @Post('logout')
  logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.userId);
  }
}

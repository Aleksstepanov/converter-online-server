import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, GetUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedRequest } from './types';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить данные о текущем пользователе' })
  getUser(@Req() req: AuthenticatedRequest): Promise<GetUserDto | null> {
    return this.userService.getUser(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }
}

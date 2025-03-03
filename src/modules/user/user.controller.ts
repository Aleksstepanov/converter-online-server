import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, GetUserDto, DeleteUserDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  get(@Param('id') id: string): Promise<GetUserDto | null> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id') id: string): Promise<DeleteUserDto> {
    return this.userService.remove(id);
  }
}

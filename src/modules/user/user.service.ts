import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, GetUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto | null> {
    await this.userRepository.update(userId, updateUserDto);
    return this.getUser(userId);
  }

  async getUser(userId: number): Promise<GetUserDto | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserWithRefreshToken(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'firstName', 'lastName', 'refreshToken'],
    });
  }
}

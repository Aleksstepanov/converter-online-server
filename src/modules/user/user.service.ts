import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, GetUserDto, DeleteUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id.toString());
  }

  async findOne(id: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async remove(id: string): Promise<DeleteUserDto> {
    await this.userRepository.delete(id);
    return { message: 'User successfully deleted' };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}

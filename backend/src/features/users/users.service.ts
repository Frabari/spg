import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findOne(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async validateUser(email: string, pass: string) {
    const user = await this.findOne(email);
    if (user?.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

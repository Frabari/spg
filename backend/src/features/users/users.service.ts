import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { Tokens } from './dtos/tokens.dto';
import { JwtTokenPayload } from './entities/jwt-token-payload.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(usersRepository);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User): Tokens {
    return {
      token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      } as JwtTokenPayload),
    };
  }

  updateBalance(user: User, amount: number) {
    return this.usersRepository.update(user, {
      balance: user.balance + amount,
    });
  }
}

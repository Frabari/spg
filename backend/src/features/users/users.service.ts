import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Tokens } from './dtos/tokens.dto';
import { JwtTokenPayload } from './entities/jwt-token-payload.entity';
import { User, UserId } from './entities/user.entity';

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

  setTelegramId(userId: UserId, telegramId: number) {
    return this.usersRepository.update(userId, {
      telegramId,
    });
  }

  async detectUnretrievedOrders() {
    const users = await this.usersRepository
      .createQueryBuilder(User.name.toLowerCase())
      .select('user.id')
      .innerJoin(Order.name.toLowerCase(), 'order', 'order.userId = user.id ')
      .where('order.status = :status', { status: OrderStatus.UNRETRIEVED })
      .groupBy('user.id')
      .having('count(*) >= :num', { num: 3 })
      .getMany();
    console.log(users);
  }
}

import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { LessThan, Repository } from 'typeorm';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import {
  NotificationPriority,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/services/notifications.service';
import { OrderStatus } from '../orders/entities/order.entity';
import { Tokens } from './dtos/tokens.dto';
import { JwtTokenPayload } from './entities/jwt-token-payload.entity';
import { User, UserId } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
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

  /**
   * Detects unretrieved orders
   */
  async detectUnretrievedOrders() {
    const result = await this.usersRepository
      .createQueryBuilder(User.name.toLowerCase())
      .where('user.blockedAt is null')
      .innerJoinAndSelect(
        'user.orders',
        'order',
        'order.status = :orderStatus and (user.lastBlockedAt is null or order.createdAt >= user.lastBlockedAt)',
        { orderStatus: OrderStatus.UNRETRIEVED },
      )
      .groupBy('user.id')
      .addSelect('count(distinct order.id)', 'unretrievedOrdersCount')
      .having('count(*) >= :num', { num: 3 })
      .getRawAndEntities();
    const users = result.entities.map((u, i) => {
      u.unretrievedOrdersCount = result.raw[i].unretrievedOrdersCount;
      return u;
    });
    for (const user of users) {
      if (user.unretrievedOrdersCount >= 5) {
        await this.usersRepository.update(
          { id: user.id },
          { blockedAt: new Date() },
        );
        await this.notificationsService.sendNotification(
          {
            type: NotificationType.ERROR,
            priority: NotificationPriority.CRITICAL,
            title: 'Your Basil account is blocked',
            message:
              'You have abandoned 5 or more orders so your account is now blocked for one month',
          },
          { id: user.id },
        );
      } else {
        await this.notificationsService.sendNotification(
          {
            type: NotificationType.ERROR,
            priority: NotificationPriority.CRITICAL,
            title: 'You may be blocked',
            message:
              'You have abandoned 3 or more orders. This may result in a one-month suspension of your account',
          },
          { id: user.id },
        );
      }
    }
  }

  /**
   * Unlocks users after a month
   */
  async unlockUsers() {
    const oneMonthAgo = DateTime.now().minus({ month: 1 });
    const usersToUnlock = await this.usersRepository.find({
      blockedAt: LessThan(oneMonthAgo.toFormat('yyyy-MM-dd hh:mm:ss')),
    });
    this.logger.log(`Unlocking users ${usersToUnlock.map(u => u.id)}`);
    for (const user of usersToUnlock) {
      await this.usersRepository.update(
        {
          id: user.id,
        },
        {
          blockedAt: null,
          lastBlockedAt: new Date(),
        },
      );
      await this.notificationsService.sendNotification(
        {
          type: NotificationType.SUCCESS,
          priority: NotificationPriority.CRITICAL,
          title: 'You have been unlocked',
          message: `Welcome back! Review our policy terms to make good use of the app. Happy buying!`,
        },
        {
          id: user.id,
        },
      );
    }
  }
}

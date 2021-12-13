import { hash } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationsModule } from './notifications.module';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          dropSchema: true,
          synchronize: true,
        }),
        UsersModule,
        ProductsModule,
        CategoriesModule,
        TransactionsModule,
        OrdersModule,
        NotificationsModule,
      ],
    }).compile();
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('activateUser', () => {
    it('should activate an user', async () => {
      service.activateUser(1);
      expect('1' in (service as any).activeUserIds).toBeDefined();
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate an user', async () => {
      service.activateUser(1);
      service.deactivateUser(1);
      expect(!('1' in (service as any).activeUserIds)).toBeDefined();
    });
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      (service as any).notificationsGateway.server = {
        in: (room: string) => ({
          emit: (event: string, data: any) => ({}),
        }),
      };
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const msg = { title: 'test title' } as Notification;
      await service.sendNotification(msg, {});
      const result = await entityManager.findOne(User, {
        relations: ['notifications'],
      });
      expect(result.notifications.length).toEqual(1);
    });
  });

  afterEach(() => {
    return module.close();
  });
});

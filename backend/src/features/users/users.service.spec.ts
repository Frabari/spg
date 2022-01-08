import { hash } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockNotificationsService } from '../../../test/utils';
import { CategoriesModule } from '../categories/categories.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from './entities/user.entity';
import { Role } from './roles.enum';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
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
    })
      .overrideProvider(NotificationsService)
      .useValue(mockNotificationsService)
      .compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should validate an existing user', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const user = await service.validateUser(email, password);
      expect(user.email).toEqual(email);
    });

    it('should fail a login when password is wrong', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const user = await service.validateUser(email, 'ciao');
      expect(user).toEqual(null);
    });
  });

  describe('login', () => {
    it('should return a jwt token', async () => {
      const tokens = await service.login({
        id: 1,
        email: 'test@example.com',
      } as User);
      expect(typeof tokens.token).toBe('string');
      expect(tokens.token.length > 1).toBe(true);
    });
  });

  describe('updateBalance', () => {
    it('should update the balance of a given user', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.EMPLOYEE,
      });
      await service.updateBalance(user, 10);
      const updatedUser = await entityManager.findOne(User, user.id);
      expect(updatedUser.balance).toEqual(10);
    });
  });

  afterEach(() => {
    return module.close();
  });
});

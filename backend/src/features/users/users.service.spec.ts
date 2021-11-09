import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrdersModule } from '../orders/orders.module';
import { hash } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

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
      ],
    }).compile();

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
      expect(tokens.token.length > 1);
    });
  });

  afterEach(() => {
    return module.close();
  });
});

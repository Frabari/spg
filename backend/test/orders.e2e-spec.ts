import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/features/users/users.module';
import { OrdersModule } from '../src/features/orders/orders.module';
import { ProductsModule } from '../src/features/products/products.module';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { validation } from '../src/constants';
import { EntityManager } from 'typeorm';
import { User } from '../src/features/users/entities/user.entity';
import { hash } from 'bcrypt';
import { Role } from '../src/features/users/roles.enum';
import { Order } from '../src/features/orders/entities/order.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validation));
    await app.init();
  });

  describe('GET /orders', () => {
    it('should fail if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/orders').expect(401);
    });

    it('should return the orders', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.EMPLOYEE,
      });
      await entityManager.save(Order, {
        user: { id: user.id },
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/orders')
        .auth(authToken, { type: 'bearer' })
        .expect(200);
    });

    it('should fail if the role is CUSTOMER', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      await entityManager.save(Order, {
        user: { id: user.id },
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/orders')
        .auth(authToken, { type: 'bearer' })
        .expect(403);
    });
  });

  afterEach(() => {
    return app.close();
  });
});
import { hash } from 'bcrypt';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validation } from '../src/constants';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { Order } from '../src/features/orders/entities/order.entity';
import { OrdersModule } from '../src/features/orders/orders.module';
import { Product } from '../src/features/products/entities/product.entity';
import { ProductsModule } from '../src/features/products/products.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/users/roles.enum';
import { UsersModule } from '../src/features/users/users.module';

describe('BasketController (e2e)', () => {
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

  describe('GET /orders/basket', () => {
    it('should fail if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/orders/basket').expect(401);
    });

    it('should return the basket of a given customer', async () => {
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
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      let order;
      await request(server)
        .get('/orders/basket')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(r => {
          order = r.body;
          expect(r.body.user.id).toEqual(user.id);
        });
      return request(server)
        .get('/orders/basket')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(r => {
          expect(r.body.id).toEqual(order.id);
        });
    });
  });

  describe('PATCH /orders/basket', () => {
    it('should fail if the user is not authenticated', async () => {
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
      return request(app.getHttpServer()).patch('/orders/basket').expect(401);
    });
  });

  it('should update the customer basket', async () => {
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
    const product = await entityManager.save(Product, {
      name: 'onions',
      description: 'very good onions',
      price: 10,
      available: 20,
    });
    const order = await entityManager.save(Order, {
      user: { id: user.id },
      entries: [
        {
          quantity: 10,
          product: { id: product.id },
        },
      ],
    });

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/users/login')
      .send({ username: email, password });
    const authToken = response.body.token;
    return request(server)
      .patch('/orders/basket')
      .auth(authToken, { type: 'bearer' })
      .send({
        user: { id: user.id },
        id: order.id,
        entries: [
          {
            quantity: 5,
            product: { id: product.id },
          },
        ],
      })
      .expect(r => {
        console.log(r);
      })
      .expect(200)
      .expect(r => {
        expect(r.body.entries[0].quantity).toEqual(5);
      });
  });
  afterEach(() => {
    return app.close();
  });
});

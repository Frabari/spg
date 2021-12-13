import { hash } from 'bcrypt';
import { DateTime, Settings } from 'luxon';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validation } from '../src/constants';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { NotificationsModule } from '../src/features/notifications/notifications.module';
import {
  Order,
  OrderStatus,
} from '../src/features/orders/entities/order.entity';
import { OrdersModule } from '../src/features/orders/orders.module';
import { Product } from '../src/features/products/entities/product.entity';
import { ProductsModule } from '../src/features/products/products.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { User } from '../src/features/users/entities/user.entity';
import { Role } from '../src/features/users/roles.enum';
import { UsersModule } from '../src/features/users/users.module';

const salesDay = DateTime.now()
  .set({
    weekday: 6,
    hour: 10,
  })
  .toMillis();
Settings.now = () => salesDay;

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
        NotificationsModule,
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
  });

  describe('GET /orders/:id', () => {
    it(`should fail if a customer tries to access someone else's order`, async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      const user1 = await entityManager.save(User, {
        email: 'email1@example.com',
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      const order = await entityManager.save(Order, {
        user: { id: user1.id },
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get(`/orders/${order.id}`)
        .auth(authToken, { type: 'bearer' })
        .expect(404);
    });
  });

  describe('POST /orders', () => {
    it('should fail if the user is not authenticated', () => {
      return request(app.getHttpServer()).post('/orders').expect(401);
    });

    it('should create an order if you are an employee', async () => {
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .post('/orders')
        .auth(authToken, { type: 'bearer' })
        .send({
          user: { id: user.id },
          entries: [
            {
              quantity: 1,
              product: { id: product.id },
            },
          ],
        })
        .expect(201);
    });

    it('should create an order if you are a manager', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.MANAGER,
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .post('/orders')
        .auth(authToken, { type: 'bearer' })
        .send({
          user: { id: user.id },
          entries: [
            {
              quantity: 1,
              product: { id: product.id },
            },
          ],
        })
        .expect(201);
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .post('/orders')
        .auth(authToken, { type: 'bearer' })
        .send({
          user: { id: user.id },
          entries: [
            {
              quantity: 1,
              product: { id: product.id },
            },
          ],
        })
        .expect(403);
    });

    it('should fail if the quantity is 0', async () => {
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .post('/orders')
        .auth(authToken, { type: 'bearer' })
        .send({
          user: { id: user.id },
          entries: [
            {
              quantity: 0,
              product: { id: product.id },
            },
          ],
        })
        .expect(400);
    });
  });

  describe('PATCH /orders/orderId', () => {
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
      const order = await entityManager.save(Order, { user: { id: user.id } });
      return request(app.getHttpServer())
        .patch('/orders/' + order.id)
        .expect(401);
    });

    it('should update a given order', async () => {
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
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
        .patch('/orders/' + order.id)
        .auth(authToken, { type: 'bearer' })
        .send({
          status: OrderStatus.COMPLETED,
        })
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 2,
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
        .patch('/orders/' + order.id)
        .auth(authToken, { type: 'bearer' })
        .send({
          status: OrderStatus.COMPLETED,
        })
        .expect(403);
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
        role: Role.RIDER,
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 2,
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
        .patch('/orders/' + order.id)
        .auth(authToken, { type: 'bearer' })
        .send({
          status: OrderStatus.COMPLETED,
        })
        .expect(403);
    });

    it('should fail if the status of the updated order is a previous one', async () => {
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      const order = await entityManager.save(Order, {
        user: { id: user.id },
        entries: [
          {
            quantity: 5,
            product: { id: product.id },
          },
        ],
        status: OrderStatus.PAID,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .patch('/orders/' + order.id)
        .auth(authToken, { type: 'bearer' })
        .send({
          status: OrderStatus.DRAFT,
        })
        .expect(400);
    });
  });

  afterEach(() => {
    return app.close();
  });
});

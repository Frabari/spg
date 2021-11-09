import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { hash } from 'bcrypt';
import { UsersModule } from '../src/features/users/users.module';
import { OrdersModule } from '../src/features/orders/orders.module';
import { ProductsModule } from '../src/features/products/products.module';
import { CategoriesModule } from '../src/features/categories/categories.module';
import { StockModule } from '../src/features/stock/stock.module';
import { TransactionsModule } from '../src/features/transactions/transactions.module';
import { Role, User } from '../src/features/users/entities/user.entity';

describe('UsersController (e2e)', () => {
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
        StockModule,
        TransactionsModule,
        OrdersModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('GET /users', () => {
    it('should fail if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should fail if the requester is an unauthorized role', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/users')
        .auth(authToken, { type: 'bearer' })
        .expect(403);
    });

    it('should return the users if the requester is an authorized role', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.MANAGER,
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/users')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(r => r.body.length === 1);
    });

    it('should return the user if the requester is authenticated yet', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = app.get(EntityManager);
      await entityManager.insert(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const server = app.getHttpServer();
      const response = await request(server)
        .post('/users/login')
        .send({ username: email, password });
      const authToken = response.body.token;
      return request(server)
        .get('/users/me')
        .auth(authToken, { type: 'bearer' })
        .expect(200)
        .expect(r => r.body.length === 1 && r.body.toEqual(User));
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John',
          surname: 'Doe',
          email: 'test@example.com',
          password: 'testpwd',
        })
        .expect(201);
      const entityManager = app.get(EntityManager);
      expect((await entityManager.find(User)).length).toEqual(1);
    });

    it('should fail if the email is not valid', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John',
          surname: 'Doe',
          email: 'not an email',
          password: 'testpwd',
        })
        .expect(400);
    });

    it('should fail if some fields are absent', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });
  });

  afterEach(() => {
    return app.close();
  });
});

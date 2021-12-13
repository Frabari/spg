import { hash } from 'bcrypt';
import { DateTime, Settings } from 'luxon';
import { EntityManager } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { UsersModule } from '../users/users.module';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderEntry, OrderEntryStatus } from './entities/order-entry.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';

const salesDay = DateTime.now()
  .set({
    weekday: 6,
    hour: 10,
  })
  .toMillis();
Settings.now = () => salesDay;

describe('OrdersService', () => {
  let service: OrdersService;
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

    service = module.get<OrdersService>(OrdersService);
  });

  describe('resolveBasket', () => {
    it('should return an existing draft order as the basket', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const order = await entityManager.save(Order, {
        user,
      });
      const basket = await service.resolveBasket(user);
      expect(order.id).toEqual(basket.id);
    });

    it('should return a new draft order as the basket when an existing one is missing', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      await service.resolveBasket(user);
      const orders = await entityManager.find(Order, {});
      expect(orders.length).toEqual(1);
    });
  });

  describe('checkOrder', () => {
    it('should fail if the quantity of the order is higher than its product', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      return expect(
        service.validateCreateDto({
          user: { id: user.id } as User,
          entries: [{ product, quantity: 20 }] as OrderEntry[],
        } as CreateOrderDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if the quantity of the order is minor than 1', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      return expect(
        service.validateCreateDto({
          user: { id: user.id } as User,
          entries: [{ product, quantity: 0 }] as OrderEntry[],
        } as CreateOrderDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if an entry in your order references is an invalid product', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      return expect(
        service.validateCreateDto({
          user: { id: user.id } as User,
          entries: [
            {
              product: {
                id: 100,
                name: 'outProduct',
                description: 'no description',
              },
              quantity: 1,
            },
          ] as OrderEntry[],
        } as CreateOrderDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should check an order dto', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      return expect(
        service.validateCreateDto({
          user: { id: user.id } as User,
          entries: [{ product, quantity: 5 }] as OrderEntry[],
        } as CreateOrderDto),
      ).resolves.toBeDefined();
    });
  });

  describe('checkOrderUpdate', () => {
    it('should change the status of the order with a following one', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      const order = await entityManager.save(Order, {
        user: { id: user.id },
      });
      expect(
        await service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.PAID,
          } as UpdateOrderDto,
          { role: Role.MANAGER } as User,
        ),
      ).toMatchObject({ status: OrderStatus.PAID });
    });

    it('should fail if the status of the updated order is a previous one', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });

      const order = await entityManager.save(Order, {
        user: { id: user.id },
        status: OrderStatus.PAID,
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.DRAFT,
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if the order status is locked', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
      let order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      await service.validateUpdateDto(
        order.id,
        {
          status: OrderStatus.LOCKED,
          entries: [
            {
              ...order.entries[0],
              quantity: 10,
            },
          ],
        } as UpdateOrderDto,
        user,
      );

      order = await entityManager.findOne(Order, order.id, {
        relations: ['entries', 'entries.product'],
      });
      expect(order.entries[0].quantity).toEqual(5);
    });

    it('should fail if the order does not exist', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
      });
      return expect(
        service.validateUpdateDto(100, {} as UpdateOrderDto, user),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should fail if the customer tries to change the entries of a LOCKED order', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
      const order = await entityManager.save(Order, {
        status: OrderStatus.LOCKED,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      const finalDto = await service.validateUpdateDto(
        order.id,
        {
          entries: [
            {
              ...order.entries[0],
              quantity: 10,
            },
          ],
        } as UpdateOrderDto,
        user,
      );

      expect(finalDto.entries).toBeUndefined();
    });

    it('should fail if the quantity of entries is less than 1', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
      const order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.COMPLETED,
            entries: [
              {
                ...order.entries[0],
                quantity: 0,
              },
            ],
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if an entry in your order references is an invalid product', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
      const order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.COMPLETED,
            entries: [
              {
                product: {
                  id: 100,
                },
                quantity: 2,
              },
            ],
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if there is not enough quantity of product to satisfy your request', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 1,
          },
        ],
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.COMPLETED,
            entries: [
              {
                ...order.entries[0],
                quantity: 100,
              },
            ],
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should fail if there is not enough quantity of product to satisfy a new entry', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.CUSTOMER,
      });
      const product1 = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 2,
      });
      const product2 = await entityManager.save(Product, {
        name: 'apples',
        description: 'very good apples',
        baseUnit: '1Kg',
        price: 5,
        available: 3,
      });
      const order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product1.id,
            },
            quantity: 1,
          },
        ],
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            status: OrderStatus.COMPLETED,
            entries: [
              order.entries[0],
              {
                product: {
                  id: product2.id,
                },
                quantity: 100,
              },
            ],
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should restore the availability of a product after has been removed from the basket', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
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
        available: 5,
      });
      const order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      await service.validateUpdateDto(
        order.id,
        {
          status: OrderStatus.COMPLETED,
          entries: [],
        } as UpdateOrderDto,
        user,
      );

      const finalProduct = await entityManager.findOne(Product, product.id);
      expect(finalProduct.available).toEqual(5);
    });

    it('farmer should not modify OrderEntryStatus to delivered status', async () => {
      const email = 'test@example.com';
      const password = 'testpwd';
      const entityManager = module.get(EntityManager);
      const user = await entityManager.save(User, {
        email,
        password: await hash(password, 10),
        name: 'John',
        surname: 'Doe',
        role: Role.FARMER,
      });
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 5,
      });
      const order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      return expect(
        service.validateUpdateDto(
          order.id,
          {
            entries: [
              {
                status: OrderEntryStatus.DELIVERED,
                product: {
                  id: product.id,
                },
              },
            ],
          } as UpdateOrderDto,
          user,
        ),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('lockBaskets', () => {
    it('should change the status of basket from DRAFT to LOCKED', async () => {
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
      const product = await entityManager.save(Product, {
        name: 'onions',
        description: 'very good onions',
        baseUnit: '1Kg',
        price: 10,
        available: 10,
      });
      let order = await entityManager.save(Order, {
        status: OrderStatus.DRAFT,
        user: { id: user.id },
        entries: [
          {
            product: {
              id: product.id,
            },
            quantity: 5,
          },
        ],
      });
      await service.lockBaskets();

      order = await entityManager.findOne(Order, order.id);
      expect(order.status).toEqual(OrderStatus.LOCKED);
    });

    /* it('should fail if the user does not has sufficient balance ', async () => {
     const email = 'test@example.com';
     const password = 'testpwd';
     const entityManager = module.get(EntityManager);
     const user = await entityManager.save(User, {
       email,
       password: await hash(password, 10),
       name: 'John',
       surname: 'Doe',
       balance: 50,
       role: Role.CUSTOMER,
     });
     const product = await entityManager.save(Product, {
       name: 'onions',
       description: 'very good onions',
       price: 10,
       available: 10,
     });
     let order = await entityManager.save(Order, {
       status: OrderStatus.DRAFT,
       user: { id: user.id },
       entries: [
         {
           product: {
             id: product.id,
           },
           quantity: 6,
         },
       ],
     });
     await service.checkOrderUpdate(
       order.id,
       {
         entries: [
           {
             id: order.entries[0].id,
             product: {
               id: product.id,
             },
             quantity: 6,
           },
         ],
       } as UpdateOrderDto,
       user,
     );

     expect(order.total).toBeGreaterThan(user.balance);
   });*/
  });

  afterEach(() => {
    return module.close();
  });
});

import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { ADMINS } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order, OrderId, OrderStatus } from './entities/order.entity';

const statuses = Object.values(OrderStatus);

@Injectable()
export class OrdersService extends TypeOrmCrudService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {
    super(ordersRepository);
  }

  async resolveBasket(user: User) {
    const basket = await this.ordersRepository.findOne(
      {
        status: OrderStatus.DRAFT,
        user,
      },
      {
        relations: ['entries', 'entries.product', 'user', 'deliveryLocation'],
      },
    );
    if (basket) {
      return basket;
    }
    return this.ordersRepository.save({ user });
  }

  async checkOrder(dto: CreateOrderDto) {
    if (dto.entries?.length) {
      for (let ei = 0; ei < dto.entries.length; ei++) {
        const entry = dto.entries[ei];
        if (entry.quantity < 1) {
          throw new BadRequestException(
            'Order.QuantityZero',
            `You make an order with a wrong quantity`,
          );
        }
        const product = await this.productsService.findOne(entry.product?.id);
        if (!product) {
          throw new BadRequestException(
            'Order.EntryProductNotFound',
            'An entry in your order references an invalid product',
          );
        }
        if (product.available < entry.quantity) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  quantity: `There is not enough ${product.name} to satisfy your request`,
                },
              },
            },
          });
        }
        await this.productsService.reserveProductAmount(
          product,
          entry.quantity,
        );
      }
    }
    return dto;
  }

  async checkOrderUpdate(
    id: OrderId,
    dto: UpdateOrderDto,
    user: User,
    isBasket = false,
  ) {
    const order = await this.ordersRepository.findOne(id, {
      relations: ['entries', 'entries.product', 'user'],
    });
    if (!order) {
      throw new NotFoundException('OrderNotFound', `Order ${id} not found`);
    }
    if (isBasket) {
      if (order.user.id !== user.id) {
        throw new ForbiddenException(
          'Order.ForbiddenEdit',
          `Cannot edit someone else's basket`,
        );
      }
      (dto as Order).user = user;
    }
    if (dto.status) {
      const oldStatusOrder = statuses.indexOf(order.status);
      const newStatusOrder = statuses.indexOf(dto.status);
      if (newStatusOrder < oldStatusOrder) {
        throw new BadRequestException(
          'Order.IllegalStatusTransition',
          `Cannot revert an order's status change`,
        );
      }
    }
    if (!ADMINS.includes(user.role)) {
      if (order.status !== OrderStatus.DRAFT) {
        delete dto.entries;
      }
      delete dto.status;
      if (![OrderStatus.DRAFT, OrderStatus.LOCKED].includes(order.status)) {
        delete dto.deliverAt;
      }
    }

    if (dto.entries?.length) {
      for (let ei = 0; ei < dto.entries.length; ei++) {
        const entry = dto.entries[ei];
        if (entry.quantity < 1) {
          throw new BadRequestException(
            'Order.QuantityZero',
            `You make an order with a wrong quantity`,
          );
        }
        const product = await this.productsService.findOne(entry.product?.id);
        if (!product) {
          throw new BadRequestException(
            'Order.EntryProductNotFound',
            'An entry in your order references an invalid product',
          );
        }
        entry.product = product;

        const existingEntry = order.entries.find(
          e => e.product.id === entry.product.id,
        );
        let delta = 0;
        if (existingEntry) {
          delta = entry.quantity - existingEntry.quantity;
          if (product.available - delta < 0) {
            throw new BadRequestException({
              constraints: {
                entries: {
                  [ei]: {
                    quantity: `There is not enough ${product.name} to satisfy your request`,
                  },
                },
              },
            });
          }
        } else {
          if (product.available < entry.quantity) {
            throw new BadRequestException({
              constraints: {
                entries: {
                  [ei]: {
                    quantity: `There is not enough ${product.name} to satisfy your request`,
                  },
                },
              },
            });
          }
          delta = entry.quantity;
        }
        if (delta !== 0) {
          await this.productsService.reserveProductAmount(product, delta);
        }
      }

      for (const oldEntry of order.entries) {
        if (!dto.entries.some(e => e.product.id === oldEntry.product.id)) {
          await this.productsService.reserveProductAmount(
            oldEntry.product,
            -oldEntry.quantity,
          );
        }
      }

      /*const total = dto.entries?.reduce(
        (acc, val) => acc + val.quantity * val.product?.price,
        0,
      );
      if(user.balance < total){
        throw new BadRequestException(
          'Order.InsufficientBalance',
          `The  user balance is insufficient to satisfy your request`,
        );
      }*/
    }
    return dto;
  }

  lockBaskets() {
    return this.ordersRepository.update(
      {
        status: OrderStatus.DRAFT,
      },
      {
        status: OrderStatus.LOCKED,
      },
    );
  }

  checkOrderBalance(order: Order, user: User) {
    if (user.balance < order.total) {
      order.insufficientBalance = true;
    }
    return order;
  }
}

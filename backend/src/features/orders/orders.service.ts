import { DateTime } from 'luxon';
import { In, Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { ADMINS } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderEntry, OrderEntryStatus } from './entities/order-entry.entity';
import { Order, OrderId, OrderStatus } from './entities/order.entity';

const statuses = Object.values(OrderStatus);

@Injectable()
export class OrdersService extends TypeOrmCrudService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderEntry)
    private readonly ordersEntryRepository: Repository<OrderEntry>,
    private readonly productsService: ProductsService,
  ) {
    super(ordersRepository);
  }

  /**
   * Resolves a user's basket (tries to find an existing
   * one or creates it otherwise)
   *
   * @param user The authenticated user
   */
  async resolveBasket(user: User) {
    const basket = await this.ordersRepository.findOne(
      {
        status: In([OrderStatus.DRAFT, OrderStatus.LOCKED]),
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

  /**
   * Validates an order creation dto
   * @param dto The incoming dto
   */
  async validateCreateDto(dto: CreateOrderDto) {
    const now = DateTime.now();
    const from = now.set({
      weekday: 6,
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const to = from.plus({ hour: 38 });
    if (now < from || now > to) {
      throw new BadRequestException(
        'Order.ReserveOutsideOfSales',
        'Cannot add products to an order while outside the sales window',
      );
    }
    if (dto.entries?.length) {
      for (let ei = 0; ei < dto.entries.length; ei++) {
        const entry = dto.entries[ei];
        if (entry.quantity < 1) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  quantity: `Add at least a product`,
                },
              },
            },
          });
        }
        const product = await this.productsService.findOne(entry.product?.id);
        if (!product) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  product: `Product not found`,
                },
              },
            },
          });
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

  /**
   * Validates an order update dto
   *
   * @param id The order's id
   * @param dto The incoming dto
   * @param user The authenticated user executing this operation
   * @param isBasket Whether this is a basket or order update
   */
  async validateUpdateDto(
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
        throw new BadRequestException({
          constraints: {
            status: `Cannot revert an order's status change`,
          },
        });
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
      const now = DateTime.now();
      const from = now.set({
        weekday: 6,
        hour: 9,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const to = from.plus({ hour: 38 });
      if (now < from || now > to) {
        throw new BadRequestException(
          'Order.ReserveOutsideOfSales',
          'Cannot add products to an order while outside the sales window',
        );
      }
      for (let ei = 0; ei < dto.entries.length; ei++) {
        const entry = dto.entries[ei];
        if (entry.quantity < 1) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  quantity: `Add at least a product`,
                },
              },
            },
          });
        }
        const product = await this.productsService.findOne(entry.product?.id);
        if (!product) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  product: `Product not found`,
                },
              },
            },
          });
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
    }
    return dto;
  }

  /**
   * Locks all the draft baskets so that
   * entries cannot be changed anymore
   */
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

  /**
   * Deletes all the draft (unconfirmed) order entries
   */
  deleteDraftOrderEntries() {
    return this.ordersEntryRepository.delete({
      status: OrderEntryStatus.DRAFT,
    });
  }

  /**
   * Compares the order total with the user balance
   *
   * @param order The order
   * @param user The authenticated user
   */
  checkOrderBalance(order: Order, user: User) {
    if (user.balance < order.total) {
      order.insufficientBalance = true;
    }
    return order;
  }

  /**
   * Closes the baskets: sets the status to
   * pending payment
   */
  closeBaskets() {
    return this.ordersRepository.update(
      {
        status: In([OrderStatus.DRAFT, OrderStatus.LOCKED]),
      },
      {
        status: OrderStatus.PENDING_PAYMENT,
      },
    );
  }
}

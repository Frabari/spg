import { DateTime } from 'luxon';
import { In, Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import {
  NotificationPriority,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/services/notifications.service';
import { ProductId } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { TransactionsService } from '../transactions/transactions.service';
import { User } from '../users/entities/user.entity';
import { ADMINS, Role, STAFF } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderEntryDto } from './dtos/update-order-entry.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import {
  OrderEntry,
  OrderEntryId,
  OrderEntryStatus,
} from './entities/order-entry.entity';
import { Order, OrderId, OrderStatus } from './entities/order.entity';

const statuses = Object.values(OrderStatus);

@Injectable()
export class OrdersService extends TypeOrmCrudService<Order> {
  private logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderEntry)
    private readonly orderEntriesRepository: Repository<OrderEntry>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
    private readonly transactionsService: TransactionsService,
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
    const options = {
      relations: ['entries', 'entries.product', 'user', 'deliveryLocation'],
    };
    const basket = await this.ordersRepository.findOne(
      {
        status: OrderStatus.DRAFT,
        user,
      },
      options,
    );
    if (basket) {
      return basket;
    }
    const newBasket = await this.ordersRepository.save({ user });
    return this.ordersRepository.findOne(newBasket.id, options);
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
      relations: ['entries', 'entries.product', 'user', 'entries.order'],
    });
    if (!order) {
      throw new NotFoundException('OrderNotFound', `Order ${id} not found`);
    }
    if (order.status === OrderStatus.LOCKED) {
      delete dto.entries;
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
      if (!STAFF.includes(user.role)) {
        delete dto.status;
      } else {
        const oldStatusOrder = statuses.indexOf(order.status);
        const newStatusOrder = statuses.indexOf(dto.status);
        if (newStatusOrder < oldStatusOrder && user.role !== Role.MANAGER) {
          throw new BadRequestException({
            constraints: {
              status: `Cannot revert an order's status change`,
            },
          });
        }
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
      delete dto.entries;
    }
    if (dto.entries) {
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
        if (
          entry.status === OrderEntryStatus.DELIVERED &&
          !ADMINS.includes(user.role)
        ) {
          throw new BadRequestException({
            constraints: {
              entries: {
                [ei]: {
                  status: `Only admins can mark entries as delivered`,
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
          entry.id = existingEntry.id;
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
          delete entry.id;
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
   * Set unretrieved orders
   */
  async closeDeliveries() {
    return this.ordersRepository.update(
      {
        status: OrderStatus.DELIVERING,
      },
      {
        status: OrderStatus.UNRETRIEVED,
      },
    );
  }

  /**
   * Removes all the draft (unconfirmed) order entries
   */
  async removeDraftOrderEntries() {
    const orderEntriesDraft = await this.orderEntriesRepository.find({
      where: {
        status: OrderEntryStatus.DRAFT,
      },
      relations: ['order', 'order.user'],
    });
    const users = new Set();
    this.logger.log(
      `Removing draft order entries ${orderEntriesDraft.map(o => o.id)}`,
    );
    await this.orderEntriesRepository.remove(orderEntriesDraft).then(() => {
      orderEntriesDraft.forEach(element => {
        if (element.order) {
          users.add(element.order?.user);
        }
      });
    });

    await this.notificationsService.sendNotification(
      {
        type: NotificationType.ERROR,
        title: 'Order modified',
        message: `Some order entries were removed from your order because the producer couldn't confirm the availability.\nPlease log in to the app to see the updated order`,
        priority: NotificationPriority.CRITICAL,
      },
      { id: In([...users].map((element: User) => element.id)) },
    );
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
  async closeBaskets() {
    const baskets = await this.ordersRepository.find({
      where: {
        status: OrderStatus.LOCKED,
      },
      relations: ['entries', 'entries.product', 'user'],
    });
    this.logger.log(`Closing baskets ${baskets.map(b => b.id)}`);
    for (const basket of baskets) {
      if (basket.entries?.length) {
        this.logger.log(`Setting order #${basket.id} to PENDING_PAYMENT`);
        await this.ordersRepository.update(basket.id, {
          status: OrderStatus.PENDING_PAYMENT,
        });
      } else {
        this.logger.log(
          `Setting order #${basket.id} to CANCELED because it has no entries`,
        );
        await this.ordersRepository.update(basket.id, {
          status: OrderStatus.CANCELED,
        });
        await this.notificationsService.sendNotification(
          {
            type: NotificationType.ERROR,
            title: 'Order cancelled',
            message: `Your order #${basket.id} was cancelled because none of its entries was confirmed by the producers`,
            priority: NotificationPriority.CRITICAL,
          },
          { id: basket.user.id },
        );
      }
    }
  }

  /**
   * Creates a payment transaction when the user balance
   * is enough to pay the active basket
   */
  async payBaskets(cancelOnInsufficientBalance = false) {
    const baskets = await this.ordersRepository.find({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
      },
      relations: ['entries', 'entries.product', 'user'],
    });
    for (const basket of baskets) {
      if (basket.entries?.length) {
        if (basket.user.balance >= basket.total) {
          await this.transactionsService.createTransaction({
            user: basket.user,
            amount: -basket.total,
          });
          await this.notificationsService.sendNotification(
            {
              type: NotificationType.SUCCESS,
              title: 'Order paid successfully',
              message: `The payment for your order #${basket.id} was successful.\n\nTotal: € ${basket.total}`,
              priority: NotificationPriority.CRITICAL,
            },
            { id: basket.user.id },
          );
          await this.ordersRepository.update(basket.id, {
            status: OrderStatus.PAID,
          });
        } else {
          if (cancelOnInsufficientBalance) {
            this.logger.log(
              `Cancelling basket #${basket.id} due to insufficient balance`,
            );
            await this.ordersRepository.update(basket.id, {
              status: OrderStatus.CANCELED,
            });
            await this.notificationsService.sendNotification(
              {
                type: NotificationType.ERROR,
                title: 'Basket cancelled',
                message: `Your active basket was cancelled because your balance was insufficient`,
                priority: NotificationPriority.CRITICAL,
              },
              { id: basket.user.id },
            );
          } else {
            await this.notificationsService.sendNotification(
              {
                type: NotificationType.ERROR,
                title: 'Insufficient balance',
                message: `Your active basket cannot be paid because your balance is insufficient. Top up your wallet by today at 6pm or your basket will be cancelled`,
                priority: NotificationPriority.CRITICAL,
              },
              { id: basket.user.id },
            );
          }
        }
      }
    }
  }

  /**
   * Find entries that contain a certain product
   */
  async getOrderEntriesContainingProduct(productId: ProductId) {
    const entries = await this.orderEntriesRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: ['order'],
    });
    return entries.sort((a, b) => +b.order.createdAt - +a.order.createdAt);
  }

  /**
   * update entries with a given product's quantity
   */
  updateOrderEntry(id: OrderEntryId, dto: UpdateOrderEntryDto) {
    return this.orderEntriesRepository.update(id, dto);
  }

  /**
   * Deletes an order entry with a given id
   */
  deleteOrderEntry(id: OrderEntryId) {
    return this.orderEntriesRepository.delete(id);
  }

  /**
   * Updates all order entries containing the given product
   */
  async updateProductOrderEntries(
    productId: ProductId,
    dto: UpdateOrderEntryDto,
  ) {
    const entries = await this.orderEntriesRepository.find({
      product: { id: productId },
    });
    if (!entries?.length) return;
    return this.orderEntriesRepository.save(
      entries.map(e => ({
        ...e,
        ...dto,
      })),
    );
  }

  /**
   * Sends a notification to users who have
   * a scheduled pickup the next day
   */
  async sendPickupNotifications() {
    const orders = await this.ordersRepository.find({
      where: {
        status: OrderStatus.PAID,
        deliveryLocation: null,
      },
      relations: ['user'],
    });
    if (orders?.length) {
      for (const o of orders) {
        if (
          DateTime.fromJSDate(o.deliverAt).day ===
          DateTime.now().plus({ day: 1 }).day
        ) {
          await this.notificationsService.sendNotification(
            {
              type: NotificationType.INFO,
              priority: NotificationPriority.CRITICAL,
              title: 'Pickup soon',
              message: `Tomorrow at ${o.deliverAt.toLocaleTimeString()} you have a pickup scheduled`,
            },
            o.user,
          );
        }
      }
    }
  }

  /**
   * Sends a reminder to users whose balance is
   * insufficient to pay an open order
   */
  async sendInsufficientBalanceReminders() {
    const os = await this.ordersRepository.find({
      where: {
        status: In([OrderStatus.DRAFT, OrderStatus.LOCKED]),
      },
      relations: ['user', 'entries'],
    });
    const ordersWithEntries = os.filter(
      o =>
        o.entries?.length > 0 &&
        this.checkOrderBalance(o, o.user).insufficientBalance,
    );
    for (const o of ordersWithEntries) {
      await this.notificationsService.sendNotification(
        {
          type: NotificationType.INFO,
          priority: NotificationPriority.CRITICAL,
          title: 'Insufficient Balance',
          message: `Remind to top-up your wallet in order to pay your order`,
        },
        o.user,
      );
    }
  }
}

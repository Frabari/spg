import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product, ProductId } from './entities/product.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {
    super(productsRepository);
  }

  /**
   * Reserves `quantity` of `products`
   */
  reserveProductAmount(product: Product, quantity: number) {
    return this.productsRepository.update(
      {
        id: product.id,
      },
      {
        available: product.available - quantity,
        reserved: product.reserved + quantity,
      },
    );
  }

  /**
   * Resets the product availability
   */
  resetProductsAvailability() {
    return this.productsRepository.update(
      {},
      {
        available: 0,
        reserved: 0,
      },
    );
  }

  async checkProduct(dto: CreateProductDto, user: User) {
    if (user.role === Role.FARMER) {
      dto.farmer = user;
      dto.public = false;
      delete dto.reserved;
    }
    if (user.role !== Role.FARMER) {
      if (!dto.farmer) {
        throw new BadRequestException({
          constraints: {
            farmer: `The product must contains farmer`,
          },
        });
      }
    }
    return dto;
  }

  async checkProductsUpdate(id: ProductId, dto: CreateProductDto, user: User) {
    const product = await this.productsRepository.findOne(id, {
      relations: ['farmer'],
    });
    if (!product) {
      throw new NotFoundException('ProductNotFound', `Product ${id} not found`);
    }

    if (user.role === Role.FARMER) {
      if (product.farmer.id !== user.id) {
        throw new BadRequestException(
          'Product error',
          `The product not belongs to this farmer`,
        );
      }
      delete dto.public;
      delete dto.reserved;
    }
    if (dto.reserved) {
      const now = DateTime.now();
      const from =
        now.weekday === 1 && now.hour <= 9
          ? now
              .set({
                weekday: 7,
                hour: 23,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              .minus({ weeks: 1 })
          : now.set({
              weekday: 7,
              hour: 23,
              minute: 0,
              second: 0,
              millisecond: 0,
            });
      const to = from.plus({ hours: 10 });
      if (now < from || now > to) {
        throw new BadRequestException({
          constraints: {
            reserved: 'Cannot edit reserved count now',
          },
        });
      }
    }

    if (dto.available) {
      const now = DateTime.now();
      const from = now.set({
        weekday: 1,
        hour: 18,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const to = now.set({
        weekday: 6,
        hour: 9,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      if (now < from || now > to) {
        throw new BadRequestException({
          constraints: {
            available: 'Cannot edit available count now',
          },
        });
      }
    }

    return dto;
  }
}

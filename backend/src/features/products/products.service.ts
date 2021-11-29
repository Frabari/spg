import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductId } from './entities/product.entity';

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
  resetProductAvailability() {
    return this.productsRepository.update(
      {},
      {
        available: 0,
        reserved: 0,
        sold: 0,
      },
    );
  }

  async checkProduct(dto: CreateProductDto, user: User) {
    if (user.role == Role.FARMER) {
      dto.farmer = user;
      dto.public = false;
      delete dto.reserved;
      delete dto.sold;
    }
    return dto;
  }

  async checkProductsUpdate(id: ProductId, dto: Product, user: User) {
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
      delete dto.reserved;
      delete dto.sold;
      delete dto.public;
    }

    return dto;
  }
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';

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
}

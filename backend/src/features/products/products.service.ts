import { Repository } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { UpdateOrderEntryDto } from '../orders/dtos/update-order-entry.dto';
import { OrdersService } from '../orders/orders.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductId } from './entities/product.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
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
        sold: 0,
      },
    );
  }

  async checkProduct(dto: CreateProductDto, user: User) {
    if (user.role === Role.FARMER) {
      dto.farmer = user;
      dto.public = false;
      delete dto.reserved;
      delete dto.sold;
    }
    return dto;
  }

  async checkProductsUpdate(id: ProductId, dto: UpdateProductDto, user: User) {
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
    }

    if (dto.reserved < product.reserved) {
      const diff = product.reserved - dto.reserved;
      const entries = await this.ordersService.getOrderEntriesContainingProduct(
        product,
      );
      let deletedEntries = 0;
      let entryIndex = 0;
      while (deletedEntries < diff) {
        const toDelete = diff - deletedEntries;
        if (toDelete < entries[entryIndex].quantity) {
          // update quantity
          const newQuantity = entries[entryIndex].quantity - toDelete;
          await this.ordersService.updateOrderEntry(entries[entryIndex].id, {
            quantity: newQuantity,
          } as UpdateOrderEntryDto);
          break;
        } else {
          // delete entry
          deletedEntries += entries[entryIndex].quantity;
          await this.ordersService.deleteOrderEntry(entries[entryIndex].id);
          entryIndex++;
        }
      }
    }

    return dto;
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { BasilRequest } from '../../../types';
import { Crud } from '../../core/decorators/crud.decorator';
import { UpdateOrderEntryDto } from '../orders/dtos/update-order-entry.dto';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../users/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { PRODUCTS_STAFF, Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Crud(Product, {
  routes: {
    only: ['getOneBase', 'updateOneBase', 'createOneBase', 'getManyBase'],
  },
  dto: {
    create: CreateProductDto,
    update: UpdateProductDto,
  },
  query: {
    join: {
      farmer: {
        eager: true,
      },
      category: {
        eager: true,
      },
      orderEntries: {},
    },
  },
})
@CrudAuth({
  filter: (req: BasilRequest) => {
    const filters: any = {};
    if (req.route.path.startsWith('/products/stock')) {
      // Farmers can only see their own products
      // for administrative purposes
      if (req.user?.role === Role.FARMER) {
        filters['farmer.id'] = req.user.id;
      }
    } else {
      // Products are visible in the storefront only when
      // public and at least one item is available
      filters.public = true;
      filters.available = { $gt: 0 };
    }
    return filters;
  },
})
@ApiTags(Product.name)
@ApiBearerAuth()
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(
    public readonly service: ProductsService,
    public readonly ordersService: OrdersService,
  ) {}

  get base(): CrudController<Product> {
    return this;
  }

  /**
   * Gets all the products in stock (independently of the
   * public/availability state) for administrative purposes
   */
  @Get('stock')
  @UseInterceptors(CrudRequestInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...PRODUCTS_STAFF)
  getManyStockProducts(@ParsedRequest() crudRequest: CrudRequest) {
    crudRequest.parsed.join.push({
      field: 'orderEntries',
    });
    return this.base.getManyBase(crudRequest) as Promise<Product[]>;
  }

  @Post('stock')
  @UseInterceptors(CrudRequestInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...PRODUCTS_STAFF)
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request: BasilRequest,
    @Body() dto: CreateProductDto,
  ) {
    const product = await this.service.validateCreateProductDto(
      dto,
      request.user,
    );
    return this.base.createOneBase(crudRequest, product as Product);
  }

  /**
   * Gets a single product from the stock (independently of the
   * public/availability state) for administrative purposes
   */
  @Get('stock/:id')
  @UseInterceptors(CrudRequestInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...PRODUCTS_STAFF)
  getOneStockProduct(@ParsedRequest() crudRequest: CrudRequest) {
    crudRequest.parsed.join.push({
      field: 'orderEntries',
    });
    return this.base.getOneBase(crudRequest);
  }

  @Patch('stock/:id')
  @UseInterceptors(CrudRequestInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...PRODUCTS_STAFF)
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request: BasilRequest,
    @Body() dto: UpdateProductDto,
    @Param('id') id: number,
  ) {
    const product = await this.service.validateUpdateProductDto(
      id,
      dto,
      request.user,
    );
    return this.base.updateOneBase(crudRequest, product as Product);
  }

  @Override()
  @UseGuards(OptionalJwtAuthGuard)
  getOne(@ParsedRequest() crudReq: CrudRequest) {
    return this.base.getOneBase(crudReq);
  }

  @Override()
  @UseGuards(OptionalJwtAuthGuard)
  getMany(@ParsedRequest() crudReq: CrudRequest) {
    return this.base.getManyBase(crudReq) as Promise<Product[]>;
  }

  @Patch(':id/order-entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...PRODUCTS_STAFF)
  async updateProductOrderEntries(
    @Param('id') id: number,
    @Body() dto: UpdateOrderEntryDto,
  ) {
    return this.ordersService.updateProductOrderEntries(id, dto);
  }
}

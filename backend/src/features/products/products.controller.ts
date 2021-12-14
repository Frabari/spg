import type { Request as ExpressRequest } from 'express';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../core/decorators/crud.decorator';
import { ParseBoolFlagPipe } from '../../core/pipes/parse-bool-flag.pipe';
import { UpdateOrderEntryDto } from '../orders/dtos/update-order-entry.dto';
import { OrdersService } from '../orders/orders.service';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../users/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { ADMINS, Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Crud(Product, {
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase', 'updateOneBase'],
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
      category: {},
    },
  },
})
@CrudAuth({
  filter: (req: ExpressRequest & { user: User }) => {
    const filters: any = {};
    if (
      req.user?.role === Role.CUSTOMER ||
      !('stock' in req.query) ||
      req.query.stock === 'false'
    ) {
      filters.public = true;
      filters.available = {
        $gt: 0,
      };
    }
    if ('stock' in req.query && req.query.stock !== 'false') {
      if (req.user.role === Role.FARMER) {
        filters['farmer.id'] = { $eq: req.user.id };
      }
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

  @Override()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiQuery({
    name: 'stock',
    type: Boolean,
    allowEmptyValue: true,
    required: false,
  })
  getMany(
    @ParsedRequest() crudReq: CrudRequest,
    @Request() req,
    @Query('stock', ParseBoolFlagPipe) stock = false,
  ) {
    crudReq.parsed.join = [{ field: 'farmer' }, { field: 'category' }];
    return this.base.getManyBase(crudReq) as Promise<Product[]>;
  }

  @Override()
  @UseGuards(OptionalJwtAuthGuard)
  getOne(@ParsedRequest() crudReq: CrudRequest, @Request() req) {
    const user = req.user as User;
    crudReq.parsed.join = [
      { field: 'farmer', select: ['id', 'name', 'surname', 'avatar'] },
      { field: 'category' },
    ];
    return this.base.getOneBase(crudReq).then(p => {
      if (user.role === Role.CUSTOMER && !p.public) {
        throw new NotFoundException(`Product ${p.id} not found`);
      }
      return p;
    });
  }

  @Override()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: CreateProductDto,
  ) {
    crudRequest.parsed.join = [{ field: 'category' }];
    const product = await this.service.checkProduct(dto, request.user);
    return this.base.createOneBase(crudRequest, product as Product);
  }

  @Override()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @Body() dto: UpdateProductDto,
    @Param('id') id: number,
  ) {
    const product = await this.service.checkProductsUpdate(
      id,
      dto,
      request.user,
    );
    return this.base.updateOneBase(crudRequest, product as Product);
  }

  @Get(':id/order-entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async getProductOrderEntries(@Param('id') id: number) {
    return this.ordersService.getOrderEntriesContainingProduct(id);
  }

  @Patch(':id/order-entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async updateProductOrderEntries(
    @Param('id') id: number,
    @Body() dto: UpdateOrderEntryDto,
  ) {
    return this.ordersService.updateProductOrderEntries(id, dto);
  }
}

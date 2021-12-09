import type { Request as ExpressRequest } from 'express';
import {
  Body,
  Controller,
  NotFoundException,
  Param,
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
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { ADMINS, Role } from '../users/roles.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Crud(Product, {
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase', 'updateOneBase'],
  },
  dto: {
    create: CreateProductDto,
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
      'stock' in req.query &&
      req.query.stock != 'false' &&
      req.user.role === Role.FARMER
    ) {
      filters['farmer.id'] = { $eq: req.user.id };
    }
    if (
      'stock' in req.query &&
      req.query.stock == 'false' &&
      req.user.role === Role.CUSTOMER
    ) {
      filters.public = true;
      filters.available = {
        $gt: 0,
      };
    }
    return filters;
  },
})
@ApiTags(Product.name)
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController implements CrudController<Product> {
  constructor(public readonly service: ProductsService) {}

  get base(): CrudController<Product> {
    return this;
  }

  @Override()
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
  @Roles(...ADMINS, Role.FARMER)
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: CreateProductDto,
  ) {
    const product = await this.service.checkProduct(dto, request.user);
    return this.base.createOneBase(crudRequest, product as Product);
  }

  @Override()
  @Roles(...ADMINS, Role.FARMER)
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @Body() dto: Product,
    @Param('id') id: number,
  ) {
    const product = await this.service.checkProductsUpdate(
      id,
      dto,
      request.user,
    );
    return this.base.updateOneBase(crudRequest, product as Product);
  }
}

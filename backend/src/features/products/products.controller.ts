import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../core/decorators/crud.decorator';
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
  getMany(@ParsedRequest() crudReq: CrudRequest, @Request() req) {
    crudReq.parsed.search = {
      $and: [
        { public: true },
        {
          available: {
            $gt: 0,
          },
        },
      ],
    };
    crudReq.parsed.join = [{ field: 'category' }];

    return this.base.getManyBase(crudReq) as Promise<Product[]>;
  }

  @Get('stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async getManyStockProducts(@Request() req) {
    //const user = req.user as User;
    return this.service.getAllStockProducts(req.user as User);
  }

  @Get('stock/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS, Role.FARMER)
  async getOneStockProduct(@Request() req, @Param('id') id: number) {
    return this.service.getSingleStockProduct(req.user as User, id);
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

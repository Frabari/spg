import {
  Controller,
  NotFoundException,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
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
      farmer: {},
      category: {},
    },
  },
})
@ApiTags(Product.name)
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
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
    const user = req.user as User;
    if (!stock || user.role === Role.CUSTOMER) {
      crudReq.parsed.search = {
        $and: crudReq.parsed.search.$and.concat({
          public: true,
          available: {
            $gt: 0,
          },
        }),
      };
    }
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
  @Roles(...ADMINS)
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: CreateProductDto,
  ) {
    const product = await this.service.checkProduct(dto, request.user);
    return this.base.createOneBase(crudRequest, product as Product);
  }
  @Override()
  @Roles(...ADMINS)
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

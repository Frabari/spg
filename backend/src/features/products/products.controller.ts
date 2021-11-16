import {
  Controller,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { Role } from '../users/roles.enum';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Crud } from '../../core/decorators/crud.decorator';

@Crud(Product, {
  routes: {
    only: ['getOneBase', 'getManyBase'],
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
  getMany(@ParsedRequest() crudReq: CrudRequest, @Request() req) {
    const user = req.user as User;
    if (user.role === Role.CUSTOMER) {
      crudReq.parsed.search = {
        $and: crudReq.parsed.search.$and.concat({
          public: true,
          available: {
            $gt: 0,
          },
        }),
      };
    }
    crudReq.parsed.join = [{ field: 'category' }];
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
}

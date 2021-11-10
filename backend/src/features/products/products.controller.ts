import { Controller, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { validation } from '../../constants';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { Role } from '../users/roles.enum';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Crud({
  model: {
    type: Product,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
  validation,
})
@Controller('products')
@ApiTags(Product.name)
export class ProductsController implements CrudController<Product> {
  constructor(public readonly service: ProductsService) {}

  get base(): CrudController<Product> {
    return this;
  }

  @Override()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMany(@ParsedRequest() crudReq: CrudRequest, @Request() req) {
    const user = (req as any).user as User;
    if (user.role === Role.CUSTOMER) {
      let publicFilter = crudReq.parsed.filter.find(f => f.field === 'public');
      console.log(publicFilter);
      if (!publicFilter) {
        publicFilter = {} as any;
        publicFilter.field = 'public';
        crudReq.parsed.filter.push(publicFilter);
      }
      publicFilter.operator = '$eq';
      publicFilter.value = true;
      console.log(crudReq.parsed.filter);
    }
    return this.base.getManyBase(crudReq) as Promise<Product[]>;
  }

  @Override()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }
}

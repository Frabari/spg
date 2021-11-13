import { Controller, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { validation } from '../../constants';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/guards/roles.guard';
import { Role, STAFF } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';

@Crud({
  model: {
    type: Order,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase'],
  },
  dto: {
    create: CreateOrderDto,
  },
  query: {
    join: {
      user: { eager: true },
      deliveredBy: {},
      entries: { eager: true },
      'entries.product': { eager: true },
    },
  },
  validation,
})
@ApiTags(Order.name)
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(public readonly service: OrdersService) {}

  get base(): CrudController<Order> {
    return this;
  }

  @Override()
  @Roles(...STAFF)
  getMany(@ParsedRequest() request: CrudRequest) {
    request.parsed.fields = ['id', 'status', 'createdAt'];
    return this.base.getManyBase(request);
  }

  @Override()
  @Roles(...STAFF)
  getOne(@ParsedRequest() request: CrudRequest) {
    return this.base.getOneBase(request);
  }

  @Override()
  @Roles(Role.MANAGER, Role.EMPLOYEE)
  async createOne(
    @ParsedRequest() request: CrudRequest,
    @ParsedBody() dto: CreateOrderDto,
  ) {
    request.parsed.join = [{ field: 'deliveredBy' }];
    const order = await this.service.checkOrder(dto);
    return this.base.createOneBase(request, order as Order);
  }
}

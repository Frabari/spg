import { Controller, Param, UseGuards } from '@nestjs/common';
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
import { ADMINS, Role, STAFF } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Crud({
  model: {
    type: Order,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase'],
  },
  dto: {
    create: CreateOrderDto,
    update: UpdateOrderDto,
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
    request.parsed.join = [{ field: 'deliveredBy' }];
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

  @Override()
  @Roles(...ADMINS)
  async updateOne(
    @ParsedRequest() request: CrudRequest,
    @ParsedBody() dto: UpdateOrderDto,
    @Param('id') id: number,
  ) {
    request.parsed.join = [{ field: 'deliveredBy' }];
    const order = await this.service.checkOrderUpdate(id, dto);
    return this.base.updateOneBase(request, dto as Order);
  }
}

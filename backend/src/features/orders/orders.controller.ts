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
    only: ['getManyBase', 'createOneBase'],
  },
  dto: {
    create: CreateOrderDto,
  },
  validation,
})
@ApiTags(Order.name)
@Controller('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(public readonly service: OrdersService) {}

  get base(): CrudController<Order> {
    return this;
  }

  @Override()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...STAFF)
  getMany(@ParsedRequest() request: CrudRequest) {
    return this.base.getManyBase(request);
  }

  @Override()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE)
  createOne(
    @ParsedRequest() request: CrudRequest,
    @ParsedBody() dto: CreateOrderDto,
  ) {
    const order = this.service.checkOrder(dto);
    return this.base.createOneBase(request, order as Order);
  }
}

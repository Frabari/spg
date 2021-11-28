import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../core/decorators/crud.decorator';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { ADMINS, Role, STAFF } from '../users/roles.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Crud(Order, {
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
})
@ApiTags(Order.name)
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController implements CrudController<Order> {
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

  @Get('basket')
  getBasket(@Request() request) {
    return this.service.resolveBasket(request.user);
  }

  @Patch('basket')
  @UseInterceptors(CrudRequestInterceptor)
  async updateBasket(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @Body() dto: UpdateOrderDto,
  ) {
    const basket = await this.service.resolveBasket(request.user);
    crudRequest.parsed.paramsFilter = [
      { field: 'id', operator: '$eq', value: basket.id },
    ];
    crudRequest.parsed.join = [{ field: 'deliveredBy' }];
    const order = await this.service.checkOrderUpdate(
      basket.id,
      dto,
      request.user,
    );
    return this.base.updateOneBase(crudRequest, order as Order).then(order => {
      console.log(order, request.user);

      if (request.user.balance < order.total) {
        order.insufficientBalance = true;
      }
      return order;
    });
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
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: UpdateOrderDto,
    @Param('id') id: number,
  ) {
    crudRequest.parsed.join = [{ field: 'deliveredBy' }];
    const order = await this.service.checkOrderUpdate(id, dto, request.user);
    return this.base.updateOneBase(crudRequest, order as Order);
  }
}

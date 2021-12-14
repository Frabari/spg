import { Request as ExpressRequest } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../core/decorators/crud.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { ADMINS, Role } from '../users/roles.enum';
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
      deliveryLocation: { eager: true },
    },
  },
})
@CrudAuth({
  filter: (req: ExpressRequest & { user: User }) => {
    const filters: any = {};
    if (req.user?.role === Role.CUSTOMER) {
      filters['user.id'] = req.user.id;
    }
    return filters;
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
  getMany(@ParsedRequest() crudRequest: CrudRequest, @Request() request) {
    crudRequest.parsed.fields = ['id', 'status', 'createdAt', 'deliverAt'];
    return this.base.getManyBase(crudRequest).then((orders: Order[]) => {
      return orders?.map(order =>
        this.service.checkOrderBalance(order, request.user),
      );
    });
  }

  @Get('basket')
  getBasket(@Request() request) {
    return this.service
      .resolveBasket(request.user)
      .then(order => this.service.checkOrderBalance(order, request.user));
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
    crudRequest.parsed.join = [
      { field: 'deliveredBy' },
      { field: 'deliveryLocation' },
      { field: 'entries' },
    ];
    const order = await this.service.validateUpdateDto(
      basket.id,
      dto,
      request.user,
      true,
    );
    return this.base
      .updateOneBase(crudRequest, order as Order)
      .then(order => this.service.checkOrderBalance(order, request.user));
  }

  @Override()
  getOne(@ParsedRequest() crudRequest: CrudRequest, @Request() request) {
    crudRequest.parsed.join = [
      { field: 'deliveredBy' },
      { field: 'deliveryLocation' },
    ];
    return this.base
      .getOneBase(crudRequest)
      .then(order => this.service.checkOrderBalance(order, request.user));
  }

  @Override()
  @Roles(Role.MANAGER, Role.EMPLOYEE)
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: CreateOrderDto,
  ) {
    crudRequest.parsed.join = [
      { field: 'deliveredBy' },
      { field: 'deliveryLocation' },
    ];
    const order = await this.service.validateCreateDto(dto);
    return this.base
      .createOneBase(crudRequest, order as Order)
      .then(order => this.service.checkOrderBalance(order, request.user));
  }

  @Override()
  @Roles(...ADMINS, Role.FARMER)
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: UpdateOrderDto,
    @Param('id') id: number,
  ) {
    crudRequest.parsed.join = [
      { field: 'deliveredBy' },
      { field: 'deliveryLocation' },
    ];
    const order = await this.service.validateUpdateDto(id, dto, request.user);
    return this.base
      .updateOneBase(crudRequest, order as Order)
      .then(order => this.service.checkOrderBalance(order, request.user));
  }
}

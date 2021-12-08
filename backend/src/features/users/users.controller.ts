import * as bcrypt from 'bcrypt';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../core/decorators/crud.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { ADMINS, Role } from './roles.enum';
import { UsersService } from './users.service';

@Crud(User, {
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase', 'updateOneBase'],
  },
  query: {
    join: {
      notifications: {},
      address: {},
    },
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
})
@ApiTags(User.name)
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMany(@ParsedRequest() crudRequest: CrudRequest, @Request() req) {
    const user = req.user as User;
    if (user.role === Role.CUSTOMER) {
      crudRequest.parsed.search = {
        $and: crudRequest.parsed.search.$and.concat({
          role: Role.FARMER,
        }),
      };
    }
    return this.base.getManyBase(crudRequest) as Promise<User[]>;
  }

  @Get('me')
  @UseInterceptors(CrudRequestInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: `Gets the current authenticated user's profile` })
  getMe(@ParsedRequest() crudRequest: CrudRequest, @Request() request) {
    const { id } = request.user;
    crudRequest.parsed.search.$and = [{ id }];
    crudRequest.parsed.join = [
      {
        field: 'notifications',
      },
      {
        field: 'address',
      },
    ];
    return this.base.getOneBase(crudRequest);
  }

  @Patch('me')
  @UseInterceptors(CrudRequestInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: `Updates the current authenticated user's profile` })
  async updateMe(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @Body() body: UpdateUserDto,
  ) {
    const { id } = request.user;
    crudRequest.parsed.search.$and = [{ id }];
    if (body.password) body.password = await bcrypt.hash(body.password, 10);
    return this.base.updateOneBase(crudRequest, body as User);
  }

  @Override()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS)
  getOne(@ParsedRequest() crudRequest: CrudRequest) {
    crudRequest.parsed.join = [
      {
        field: 'address',
      },
    ];
    return this.base.getOneBase(crudRequest);
  }

  @Override()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS)
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Request() request,
    @ParsedBody() dto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    crudRequest.parsed.join = [
      { field: 'notifications' },
      { field: 'address' },
    ];
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.base.updateOneBase(crudRequest, dto as User);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
  ) {
    req.parsed.join = [{ field: 'notifications' }, { field: 'address' }];
    dto.password = await bcrypt.hash(dto.password, 10);
    return this.base.createOneBase(req, dto as User);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Logs in a user with local credentials' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  login(@Request() req, @Body() dto: LoginDto) {
    return this.service.login(req.user);
  }
}

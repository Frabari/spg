import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from './guards/roles.guard';
import { ADMINS } from './roles.enum';
import { Crud } from '../../core/decorators/crud.decorator';

@Crud(User, {
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase'],
  },
  dto: {
    create: CreateUserDto,
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
  @Roles(...ADMINS)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req) as Promise<User[]>;
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: `Gets the current authenticated user's profile` })
  getMe(@Request() req) {
    return this.service.findOne(req.user.id);
  }

  @Override()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMINS)
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
  ) {
    dto.password = await bcrypt.hash(dto.password, 10);
    return this.base.createOneBase(req, dto as User);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Logs in a user with local credentials' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req, @Body() dto: LoginDto) {
    return this.service.login(req.user);
  }
}

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Role, User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesGuard } from './guards/roles.guard';

const { MANAGER, WAREHOUSE_MANAGER, WAREHOUSE_WORKER, EMPLOYEE } = Role;

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
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
  @Roles(MANAGER, WAREHOUSE_MANAGER, WAREHOUSE_WORKER, EMPLOYEE)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req) as Promise<User[]>;
  }

  @Override()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MANAGER, WAREHOUSE_MANAGER, WAREHOUSE_WORKER, EMPLOYEE)
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  /**
   * Logs in a user with local credentials
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Logs in a user with local credentials' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req, @Body() dto: LoginDto) {
    return this.service.login(req.user);
  }
}

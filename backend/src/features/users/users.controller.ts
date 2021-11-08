import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  @UseGuards(JwtAuthGuard)
  @Roles(MANAGER, WAREHOUSE_MANAGER, WAREHOUSE_WORKER, EMPLOYEE)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req) as Promise<User[]>;
  }

  @Override()
  @UseGuards(JwtAuthGuard)
  @Roles(MANAGER, WAREHOUSE_MANAGER, WAREHOUSE_WORKER, EMPLOYEE)
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  /**
   * Logs in a user with local credentials
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Body() body: LoginDto) {
    return this.service.login(req.user);
  }
}

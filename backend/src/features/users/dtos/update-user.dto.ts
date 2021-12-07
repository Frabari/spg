import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(User, [
  'name',
  'surname',
  'email',
  'password',
  'avatar',
  'address',
] as const) {}

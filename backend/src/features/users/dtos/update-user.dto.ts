import { IsOptional } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Role } from '../roles.enum';

export class UpdateUserDto extends PartialType(
  OmitType(User, [
    'balance',
    'notifications',
    'orders',
    'orders',
    'products',
    'deliveries',
    'transactions',
  ] as const),
) {
  @IsOptional()
  name: string;

  @IsOptional()
  surname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  role: Role;

  @IsOptional()
  avatar: string;
}

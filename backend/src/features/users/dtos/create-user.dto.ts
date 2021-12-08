import { Exclude } from 'class-transformer';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'name',
  'surname',
  'email',
  'password',
  'avatar',
] as const) {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  surname: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;
}

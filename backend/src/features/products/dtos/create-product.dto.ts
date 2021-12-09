import { Expose } from 'class-transformer';
import { Allow, IsDefined, IsInt, IsString, IsUrl, Min } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { ADMINS, STAFF } from '../../users/roles.enum';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, ['id'] as const) {
  @Allow({ groups: ADMINS })
  public: boolean;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsDefined()
  @Min(0)
  price: number;

  @IsString()
  @IsDefined()
  baseUnit: string;

  @IsInt()
  @IsDefined()
  @Min(0)
  available: number;

  @IsInt()
  @Min(0)
  @Expose({ groups: STAFF })
  reserved: number;

  @IsDefined()
  @IsString()
  @IsUrl()
  image: string;
}

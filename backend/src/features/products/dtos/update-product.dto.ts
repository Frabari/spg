import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends OmitType(Product, ['id'] as const) {
  @IsBoolean()
  @Expose()
  public: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  baseUnit: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  available: number;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;
}

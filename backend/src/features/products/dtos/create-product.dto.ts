import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, ['id'] as const) {
  @IsBoolean()
  @Expose()
  public: boolean;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsDefined()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  baseUnit: string;

  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  @Min(0)
  available: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @IsDefined()
  category: Category;
}

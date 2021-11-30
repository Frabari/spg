import { Exclude, Expose } from 'class-transformer';
import { Allow, IsIn, IsString, IsUrl, Min } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { STAFF } from '../../users/roles.enum';

export type ProductId = number;

export enum ProductMeasures {
  /**
   * Kg of product selected
   */
  KG = 'Kg',

  /**
   * hg of product selected
   */
  HG = 'hg',

  /**
   *  g of product selected
   */
  G = 'g',

  /**
   * unit of product selected
   */
  UNIT = 'unit',
}

@Entity()
@Exclude()
export class Product {
  @PrimaryGeneratedColumn()
  @Expose()
  id: ProductId;

  /**
   * If true this product is visible and saleable
   */
  @Column({ default: false })
  @Allow()
  @Expose({ groups: STAFF })
  public: boolean;

  /**
   * A short name
   */
  @Column()
  @Allow()
  @Expose()
  name: string;

  /**
   * A detailed description
   */
  @Column()
  @Allow()
  @Expose()
  description: string;

  /**
   * Price in €
   */
  @Column()
  @Min(0)
  @Expose()
  price: number;

  @Column({ default: ProductMeasures.KG, nullable: false })
  @IsString()
  @IsIn(Object.values(ProductMeasures))
  @Expose()
  unitOfMeasure: ProductMeasures;

  /**
   * The number of available units of this product
   * to be sold right now
   */
  @Column({ default: 0 })
  @Allow()
  @Expose()
  available: number;

  /**
   * The number of units currently in customer orders
   */
  @Column({ default: 0 })
  @Allow()
  @Expose({ groups: STAFF })
  reserved: number;

  /**
   * The number of sold units
   */
  @Column({ default: 0 })
  @Allow()
  @Expose({ groups: STAFF })
  sold: number;

  /**
   * The category to which this product belongs
   */
  @ManyToOne(() => Category, cat => cat.products)
  @Allow()
  @Expose()
  category: Category;

  /**
   * The farmer who produces this product
   */
  @ManyToOne(() => User, user => user.products)
  @Allow()
  @Expose()
  farmer: User;

  /**
   * An url pointing to the product image
   */
  @Column({ default: null })
  @IsUrl()
  @Expose()
  image: string;
}

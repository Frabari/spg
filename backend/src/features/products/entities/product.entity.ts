import { Exclude, Expose } from 'class-transformer';
import { Allow, IsBoolean, IsInt, IsString, IsUrl, Min } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { ADMINS, Role, STAFF } from '../../users/roles.enum';

export type ProductId = number;

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
  @Expose({ groups: ADMINS.concat(Role.FARMER) })
  @IsBoolean()
  public: boolean;

  /**
   * A short name
   */
  @Column()
  @Expose()
  @IsString()
  name: string;

  /**
   * A detailed description
   */
  @Column()
  @Expose()
  @IsString()
  description: string;

  /**
   * Price in €
   */
  @Column()
  @Min(0)
  @Expose()
  price: number;

  /**
   * The unit of the products
   */
  @Column()
  @Expose()
  @IsString()
  baseUnit: string;

  /**
   * The number of available units of this product
   * to be sold right now
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Expose()
  available: number;

  /**
   * The number of units currently in customer orders
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Expose({ groups: STAFF })
  reserved: number;

  /**
   * The number of sold units
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Expose({ groups: STAFF })
  sold: number;

  /**
   * The category to which this product belongs
   */
  @ManyToOne(() => Category, cat => cat.products)
  @Expose()
  @Allow()
  category: Category;

  /**
   * The farmer who produces this product
   */
  @ManyToOne(() => User, user => user.products)
  @Expose()
  @Allow()
  farmer: User;

  /**
   * An url pointing to the product image
   */
  @Column({ default: null })
  @IsUrl()
  @Expose()
  @IsString()
  image: string;
}

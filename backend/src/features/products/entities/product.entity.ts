import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsNotEmpty, IsUrl, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { STAFF } from '../../users/roles.enum';

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
  @IsNotEmpty()
  @Expose({ groups: STAFF })
  public: boolean;

  /**
   * A short name
   */
  @Column()
  @IsNotEmpty()
  @Expose()
  name: string;

  /**
   * A detailed description
   */
  @Column()
  @IsNotEmpty()
  @Expose()
  description: string;

  /**
   * Price in €
   */
  @Column()
  @IsNotEmpty()
  @Min(0)
  @Expose()
  price: number;

  /**
   * The number of available units of this product
   * to be sold right now
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Expose()
  available: number;

  /**
   * The number of units currently in customer orders
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Expose({ groups: STAFF })
  reserved: number;

  /**
   * The number of sold units
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Expose({ groups: STAFF })
  sold: number;

  /**
   * The category to which this product belongs
   */
  @ManyToOne(() => Category, cat => cat.products)
  @Expose()
  category: Category;

  /**
   * The farmer who produces this product
   */
  @ManyToOne(() => User, user => user.products)
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

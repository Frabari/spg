import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';

export type ProductId = number;

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: ProductId;

  /**
   * A short name
   */
  @Column()
  @IsNotEmpty()
  name: string;

  /**
   * A detailed description
   */
  @Column()
  @IsNotEmpty()
  description: string;

  /**
   * Price in €
   */
  @Column()
  @IsNotEmpty()
  @Min(0)
  price: number;

  /**
   * The number of available units of this product
   * to be sold right now
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  available: number;

  /**
   * The number of units currently in customer orders
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  reserved: number;

  /**
   * The number of sold units
   */
  @Column({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  sold: number;

  /**
   * The category to which this product belongs
   */
  @ManyToOne(() => Category, cat => cat.products)
  category: Category;
}

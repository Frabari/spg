import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export type CategoryId = number;

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: CategoryId;

  /**
   * The products in this category
   */
  @OneToMany(() => Product, prod => prod.category)
  products: Product[];

  /**
   * The display name of this category
   * @example Fruit & vegetables
   */
  @Column()
  @IsNotEmpty()
  name: string;

  /**
   * A slug representing this category
   * @example fruit-vegetables
   */
  @Column({ unique: true })
  @IsNotEmpty()
  slug: string;
}
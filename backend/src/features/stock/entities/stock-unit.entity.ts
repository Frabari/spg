import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { IsNotEmpty, Min } from 'class-validator';

export type StockUnitId = number;

@Entity()
export class StockUnit {
  @PrimaryGeneratedColumn()
  id: StockUnitId;

  /**
   * The farmer who supplies this product
   */
  @ManyToOne(() => User, farmer => farmer.stockUnits)
  farmer: User;

  /**
   * The supplied product
   */
  @ManyToOne(() => Product)
  product: Product;

  /**
   * The date from when this stock unit is available
   */
  @Column()
  @IsNotEmpty()
  availabilityStart: Date;

  /**
   * The number of units in this stock
   */
  @Column({ default: 0 })
  @IsNotEmpty()
  @Min(0)
  available: number;

  /**
   * The number of units currently in customer orders
   */
  @Column({ default: 0 })
  @IsNotEmpty()
  @Min(0)
  reserved: number;

  /**
   * The number of sold units
   */
  @Column({ default: 0 })
  @IsNotEmpty()
  @Min(0)
  sold: number;
}

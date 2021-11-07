import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockUnit } from './entities/stock-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockUnit])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

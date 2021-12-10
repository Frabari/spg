import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '../../core/services/typeorm-crud.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService extends TypeOrmCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
  }
}

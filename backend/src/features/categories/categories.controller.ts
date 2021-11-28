import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '../../core/decorators/crud.decorator';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Crud(Category, {
  routes: {
    only: ['getManyBase'],
  },
})
@ApiTags(Category.name)
@Controller('categories')
export class CategoriesController {
  constructor(public readonly service: CategoriesService) {}
}
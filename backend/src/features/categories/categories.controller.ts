import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '../../core/decorators/crud.decorator';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';

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

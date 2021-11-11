import {
  Crud as CrudBase,
  CrudOptions as CrudOptionsBase,
} from '@nestjsx/crud';
import { CrudRoutesFactory } from '../factories/crud-routes.factory';
import { validation } from '../../constants';

export type CrudOptions = Omit<CrudOptionsBase, 'model' | 'validation'>;

export const Crud = (type: any, options: CrudOptions) =>
  CrudBase({
    ...options,
    routesFactory: CrudRoutesFactory,
    model: {
      type,
    },
    validation,
  });

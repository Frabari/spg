import {
  Crud as CrudBase,
  CrudOptions as CrudOptionsBase,
} from '@nestjsx/crud';
import { validation } from '../../constants';
import { CrudRoutesFactory } from '../factories/crud-routes.factory';

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
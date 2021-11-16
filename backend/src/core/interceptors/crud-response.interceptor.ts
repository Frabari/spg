import { CallHandler, ExecutionContext } from '@nestjs/common';
import {
  CrudActions,
  CrudResponseInterceptor as CrudResponseInterceptorBase,
  SerializeOptions,
} from '@nestjsx/crud';
import { isFalse, isObject, isFunction } from '@nestjsx/util';
import { map } from 'rxjs';
import {
  classToPlain,
  classToPlainFromExist,
  ClassTransformOptions,
} from 'class-transformer';

const actionToDtoNameMap: {
  [key in CrudActions]: keyof SerializeOptions;
} = {
  [CrudActions.ReadAll]: 'getMany',
  [CrudActions.ReadOne]: 'get',
  [CrudActions.CreateMany]: 'createMany',
  [CrudActions.CreateOne]: 'create',
  [CrudActions.UpdateOne]: 'update',
  [CrudActions.ReplaceOne]: 'replace',
  [CrudActions.DeleteAll]: 'delete',
  [CrudActions.DeleteOne]: 'delete',
  [CrudActions.RecoverOne]: 'recover',
};

type Context = ExecutionContext & { serializeOptions: ClassTransformOptions };

export class CrudResponseInterceptor extends CrudResponseInterceptorBase {
  intercept(context: Context, next: CallHandler) {
    const userRole = context.switchToHttp().getRequest().user?.role;
    if (userRole) {
      context.serializeOptions = {
        groups: [userRole],
      };
    }
    return next.handle().pipe(map(data => this.serialize(context, data)));
  }

  protected transformData(dto: any, data: any, options: ClassTransformOptions) {
    if (!isObject(data) || isFalse(dto)) {
      return data;
    }
    if (!isFunction(dto)) {
      return data.constructor !== Object ? classToPlain(data, options) : data;
    }
    return data instanceof dto
      ? classToPlain(data, options)
      : classToPlain(classToPlainFromExist(data, new dto(), options), options);
  }

  protected serialize(context: Context, data: any): any {
    const { crudOptions, action } = this.getCrudInfo(context);
    const { serialize } = crudOptions;
    const dto = serialize[actionToDtoNameMap[action]];
    const isArray = Array.isArray(data);
    const serializeOptions = context.serializeOptions ?? {};

    switch (action) {
      case CrudActions.ReadAll:
        return isArray
          ? (data as any[]).map(item =>
              this.transformData(serialize.get, item, serializeOptions),
            )
          : this.transformData(dto, data, serializeOptions);
      case CrudActions.CreateMany:
        return isArray
          ? (data as any[]).map(item =>
              this.transformData(dto, item, serializeOptions),
            )
          : this.transformData(dto, data, serializeOptions);
      default:
        return this.transformData(dto, data, serializeOptions);
    }
  }
}

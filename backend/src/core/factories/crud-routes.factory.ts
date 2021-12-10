import {
  BaseRouteName,
  CrudRoutesFactory as CrudRoutesFactoryBase,
} from '@nestjsx/crud';
import { R } from '@nestjsx/crud/lib/crud';
import { isArrayFull } from '@nestjsx/util';
import { CrudRequestInterceptor } from '../interceptors/crud-request.interceptor';
import { CrudResponseInterceptor } from '../interceptors/crud-response.interceptor';

export class CrudRoutesFactory extends CrudRoutesFactoryBase {
  protected setInterceptors(name: BaseRouteName) {
    const interceptors = this.options.routes[name].interceptors;
    R.setInterceptors(
      [
        CrudRequestInterceptor,
        CrudResponseInterceptor,
        ...(isArrayFull(interceptors)
          ? /* istanbul ignore next */ interceptors
          : []),
      ],
      this.targetProto[name],
    );
  }
}

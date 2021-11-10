import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs';

export class RoleBasedSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };
    const userRole = context.switchToHttp().getRequest().user?.role;
    if (userRole) {
      options.groups = [userRole];
    }
    return next.handle().pipe(map(res => this.serialize(res, options)));
  }
}

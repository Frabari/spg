import { map } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import {
  COMPUTED_FIELDS,
  ComputedFields,
} from '../decorators/computed.decorator';

export class ComputedInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => {
        if (data.constructor) {
          const computedFileds: ComputedFields = Reflect.getMetadata(
            COMPUTED_FIELDS,
            data,
          );
          if (computedFileds) {
            Object.entries(computedFileds).forEach(([key, valueGetter]) => {
              data[key] = valueGetter(data);
            });
          }
        }
        return data;
      }),
    );
  }
}

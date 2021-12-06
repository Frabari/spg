import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export interface ErrorsObject {
  [key: string]: string | ErrorsObject;
}

const errorsToObject = (errors: ValidationError[]) => {
  const res: ErrorsObject = {};
  errors.forEach(e => {
    if (e.children?.length) {
      res[e.property] = errorsToObject(e.children);
    } else {
      res[e.property] = [res[e.property], Object.values(e.constraints)]
        .filter(i => i != null)
        .join(', ');
    }
  });
  return res;
};

export const validation: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  exceptionFactory: errors =>
    new BadRequestException({
      constraints: errorsToObject(errors),
    }),
};

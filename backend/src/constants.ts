import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export interface ErrorsObject {
  [key: string]: string | ErrorsObject;
}

const capitalize = (str: string) => str[0].toUpperCase() + str.substring(1);

const errorsToObject = (errors: ValidationError[]) => {
  const res: ErrorsObject = {};
  errors.forEach(e => {
    if (e.children?.length) {
      res[e.property] = errorsToObject(e.children);
    } else {
      res[e.property] = capitalize(
        [res[e.property], Object.values(e.constraints)]
          .filter(i => i != null)
          .join(', '),
      );
    }
  });
  return res;
};

export const validation: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  skipMissingProperties: true,
  exceptionFactory: errors =>
    new BadRequestException({
      constraints: errorsToObject(errors),
    }),
};

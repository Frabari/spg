import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBoolFlagPipe
  implements PipeTransform<string | boolean, Promise<boolean>>
{
  async transform(value: string | boolean) {
    return value != 'false' && value !== undefined;
  }
}

import { applyDecorators, SerializeOptions, SetMetadata } from '@nestjs/common';
import { Role } from './entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    SerializeOptions({
      groups: roles,
    }),
  );

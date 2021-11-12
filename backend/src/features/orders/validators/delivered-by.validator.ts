import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/roles.enum';

@ValidatorConstraint({ name: 'deliveredBy', async: false })
export class DeliveredBy implements ValidatorConstraintInterface {
  validate(user: User) {
    return !user || user.role === Role.RIDER;
  }

  defaultMessage() {
    return 'User with wrong role set as an order rider';
  }
}

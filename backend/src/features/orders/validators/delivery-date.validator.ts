import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'deliveredBy', async: false })
export class DeliveryDateValidator implements ValidatorConstraintInterface {
  validate(date: Date) {
    if (!date) {
      return true;
    }
    const deliveryDate = DateTime.fromJSDate(date);
    const from = DateTime.now()
      .plus({ week: 1 })
      .set({ weekday: 3, hour: 8, minute: 0, second: 0, millisecond: 0 });
    const to = from.set({ weekday: 7, hour: 18 });
    return deliveryDate >= from && deliveryDate <= to;
  }

  defaultMessage() {
    return 'Deliveries and pickup only occur from Wednesday to Friday';
  }
}

import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { User } from '../../features/users/entities/user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  user.name = firstName;
  user.surname = lastName;
  user.email = faker.internet.email(firstName, lastName);
  user.password = "$2a$12$CMiDs8Sd075iEGfu6Qt4LeDqYICyHlAxOvI6Kf8PvAmcckEs.yV6W";
  user.role = faker.random.number(6);
  return user;
});
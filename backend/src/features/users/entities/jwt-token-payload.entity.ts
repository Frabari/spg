import { UserId } from './user.entity';

export class JwtTokenPayload {
  sub: UserId;
  email: string;
}

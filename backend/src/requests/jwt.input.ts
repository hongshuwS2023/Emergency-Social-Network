import {Role, Status} from '../user/user.entity';

export default interface JwtInput {
  id: string;
  role: Role;
  status: Status;
  iat: number;
  exp: number;
}

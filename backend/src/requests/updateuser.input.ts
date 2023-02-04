import {Role, Status} from '../user/user.entity';

export interface UpdateUserInput {
  id: number;
  username?: string;
  password?: string;
  role?: Role;
  status?: Status;
}

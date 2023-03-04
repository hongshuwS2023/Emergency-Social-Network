import {Role, Status} from '../user.entity';

export default interface UpdateUserInput {
  id: number;
  username?: string;
  password?: string;
  role?: Role;
  status?: Status;
}

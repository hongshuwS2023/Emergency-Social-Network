import {OnlineStatus, Role, Status} from '../user/user.entity';

export default interface UpdateUserInput {
  id: number;
  role?: Role;
  status?: Status;
  onlineStatus?: OnlineStatus;
}

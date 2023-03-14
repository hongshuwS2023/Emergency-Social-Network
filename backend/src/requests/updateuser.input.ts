import {OnlineStatus, Role, Status} from '../user/user.entity';

export default interface UpdateUserInput {
  id: string;
  role?: Role;
  status?: Status;
  onlineStatus?: OnlineStatus;
  statusTimeStamp?: string;
}

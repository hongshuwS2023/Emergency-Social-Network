import {AccountStatus, Role} from '../user/user.entity';

export default interface AdminChangeInput {
  id: string;
  accountStatus?: AccountStatus;
  role?: Role;
  username?: string;
  password?: string;
}

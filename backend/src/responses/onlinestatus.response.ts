import {Status} from '../user/user.entity';

export default class OnlineStatusResponse {
  id: number;
  name: string;
  status: Status;
  onlineStatus: boolean;
  constructor(id: number, name: string, status: Status, onlineStatus: boolean) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.onlineStatus = onlineStatus;
  }
}

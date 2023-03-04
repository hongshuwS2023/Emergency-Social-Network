import {Room} from '../room/room.entity';
import {OnlineStatus, Role, Status} from '../user/user.entity';

export default class UserResponse {
  id: number;
  name: string;
  status: Status;
  onlineStatus: OnlineStatus;
  role: Role;
  rooms: Room[];
  constructor(
    id: number,
    name: string,
    status: Status,
    onlineStatus: OnlineStatus,
    role: Role,
    rooms: Room[]
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.onlineStatus = onlineStatus;
    this.role = role;
    this.rooms = rooms;
  }
}

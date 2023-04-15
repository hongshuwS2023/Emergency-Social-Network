import {RoomType} from '../room/room.entity';
export interface CreateChatGroupInput {
  roomId: string;
  userId: string;
  type: RoomType;
}

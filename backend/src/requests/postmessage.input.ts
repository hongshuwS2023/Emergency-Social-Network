import {Status} from '../user/user.entity';

export interface PostMessageInput {
  userId: number;
  content: string;
  roomId: string;
}
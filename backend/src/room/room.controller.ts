import {NextFunction, Request, Response} from 'express';
import { JoinRoomInput } from '../requests/joinroom.input';
import { PostMessageInput } from '../requests/postmessage.input';
import { SocketServer } from '../utils/socketServer';
import RoomService from './room.service';

export default class RoomController {
  roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  async joinRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const joinRoomInput: JoinRoomInput = req.body;
      const room = await this.roomService.joinRoom(joinRoomInput);
      res.send(room.id);
    } catch (error) {
      next(error);
    }
  }
}

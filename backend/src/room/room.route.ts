import {Router} from 'express';
import {JoinRoomInput} from '../requests/joinroom.input';
import RoomController from './room.controller';

export default class RoomRoute {
  router: Router;
  roomController: RoomController;

  constructor() {
    this.router = Router();
    this.roomController = new RoomController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/:roomName', async (req, res, next) => {
      try {
        const roomName = req.params.roomName;
        const room = await this.roomController.getRoom(roomName);
        res.send(room);
      } catch (error) {
        next(error);
      }
    });
    this.router.post('/', async (req, res, next) => {
      try {
        const joinRoomInput: JoinRoomInput = req.body;
        const room = await this.roomController.joinRoom(joinRoomInput);
        res.send(room.id);
      } catch (error) {
        next(error);
      }
    });
  }
  getRouter() {
    return this.router;
  }
}

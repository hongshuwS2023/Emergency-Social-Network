import {Router} from 'express';
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
    this.router.get('/:roomName', (req, res, next) => {
      this.roomController.getRoom(req, res, next);
    });
    this.router.post('/', (req, res, next) => {
      this.roomController.joinRoom(req, res, next);
    });
  }
  getRouter() {
    return this.router;
  }
}

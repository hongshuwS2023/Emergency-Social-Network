import {Router} from 'express';
import {JoinRoomInput} from '../requests/joinroom.input';
import RoomController from './room.controller';
import {CreateChatGroupInput} from '../requests/createchatgroup.input';
import {UpdateChatGroupInput} from '../requests/updatechatgroup.input';

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
        res.send(room);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/', async (req, res, next) => {
      try {
        const rooms = await this.roomController.getChatGroup();
        res.send(rooms);
      } catch (error) {
        next(error);
      }
    });
    this.router.post('/chatgroup', async (req, res, next) => {
      try {
        const createChatGroupInput: CreateChatGroupInput = req.body;
        const room = await this.roomController.createGroupChat(
          createChatGroupInput
        );
        res.send(room);
      } catch (error) {
        next(error);
      }
    });

    this.router.put('/:roomId', async (req, res, next) => {
      try {
        const roomId = req.params.roomId;
        const updateChatGroupInput: UpdateChatGroupInput = req.body;
        const room = await this.roomController.updateGroupChat(
          roomId,
          updateChatGroupInput
        );
        res.send(room);
      } catch (error) {
        next(error);
      }
    });
  }
  getRouter() {
    return this.router;
  }
}

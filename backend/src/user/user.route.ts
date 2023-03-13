import {Router} from 'express';
import UpdateUserInput from '../requests/updateuser.input';
import { SocketServer } from '../utils/socketServer';
import UserController from './user.controller';

export default class UserRoute {
  router: Router;
  userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/:userId', async (req, res, next) => {
      try {
        const userId = req.params.userId;
        res.send(await this.userController.getUser(userId));
      } catch (error) {
        next(error);
      }
    });

    this.router.put('/', async (req, res, next) => {
      try {
        const updateUserInput: UpdateUserInput = req.body;
        res.send(await this.userController.updateUser(updateUserInput));
        SocketServer.getInstance().broadcastUserStatus();
      } catch (error) {
        next(error);
      }
    });

    this.router.get('/', async (_, res, next) => {
      try {
        res.send(await this.userController.getUsers());
      } catch (error) {
        next(error);
      }
    });

    this.router.delete('/:userId', async (req, res, next) => {
      try {
        const userId = req.params.userId;
        await this.userController.deleteUser(userId);
        res.sendStatus(200);
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

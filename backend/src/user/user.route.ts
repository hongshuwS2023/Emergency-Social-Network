import {Router} from 'express';
import UserController from './user.contoller';

export default class UserRoute {
  router: Router;
  userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/:userId', (req, res) => {
      this.userController.getUser(req, res);
    });

    this.router.put('/', (req, res) => {
      this.userController.updateUser(req, res);
    });

    this.router.delete('/:userId', (req, res) => {
      this.userController.deleteUser(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

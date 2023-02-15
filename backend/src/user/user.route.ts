import {Router} from 'express';
import UserController from './user.controller.ts';

export default class UserRoute {
  router: Router;
  userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/:userId', (req, res, next) => {
      this.userController.getUser(req, res, next);
    });

    this.router.put('/', (req, res, next) => {
      this.userController.updateUser(req, res, next);
    });

    this.router.delete('/:userId', (req, res, next) => {
      this.userController.deleteUser(req, res, next);
    });
  }

  getRouter() {
    return this.router;
  }
}

import {Router} from 'express';
import AuthController from './auth.controller';

export default class AuthRoute {
  router: Router;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.post('/register', (req, res) => {
      this.authController.registerUser(req, res);
    });

    this.router.post('/login', (req, res) => {
      this.authController.loginUser(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

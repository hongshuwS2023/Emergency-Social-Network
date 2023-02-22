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
    this.router.post('/register', (req, res, next) => {
      this.authController.registerUser(req, res, next);
    });

    this.router.post('/login', (req, res, next) => {
      this.authController.loginUser(req, res, next);
    });

    this.router.post('/logout', (req, res, next) => {
      this.authController.logoutUser(req, res, next);
    });
  }

  getRouter() {
    return this.router;
  }
}

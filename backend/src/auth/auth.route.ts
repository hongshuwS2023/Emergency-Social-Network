import {NextFunction, Request, Response, Router} from 'express';
import AuthController from './auth.controller';
import AuthUserInput from '../requests/authuser.input';
import LogoutInput from '../requests/logout.input';

export default class AuthRoute {
  router: Router;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.post(
      '/register',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const authUserInput: AuthUserInput = req.body;
          res.send(await this.authController.registerUser(authUserInput));
        } catch (err) {
          next(err);
        }
      }
    );

    this.router.post(
      '/login',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const authUserInput: AuthUserInput = req.body;
          res.send(await this.authController.loginUser(authUserInput));
        } catch (err) {
          next(err);
        }
      }
    );

    this.router.post(
      '/logout',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const logoutInput: LogoutInput = req.body;
          res.send(await this.authController.logoutUser(logoutInput));
        } catch (err) {
          next(err);
        }
      }
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

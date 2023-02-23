import {NextFunction, Request, Response} from 'express';
import {AuthUserInput} from '../requests/authuser.input';
import AuthService from './auth.service';
import {LogoutInput} from '../requests/logout.input';
export default class AuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUserInput: AuthUserInput = req.body;
      const token = await this.authService.registerUser(authUserInput);
      res.send(token);
    } catch (err) {
      next(err);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const authUserInput: AuthUserInput = req.body;
      const authResponse = await this.authService.loginUser(authUserInput);
      res.send(authResponse);
    } catch (err) {
      next(err);
    }
  }
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const logoutInput: LogoutInput = req.body;
      const user = await this.authService.logoutUser(logoutInput);

      res.send(user);
    } catch (err) {
      next(err);
    }
  }
}

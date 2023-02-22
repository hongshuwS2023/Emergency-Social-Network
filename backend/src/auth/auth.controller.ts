import {NextFunction, Request, Response} from 'express';
import {AuthUserInput} from '../requests/authuser.input';
import AuthService from './auth.service';
import { SocketServer } from '../utils/socketServer';
import OnlineStatusResponse from '../responses/onlinestatus.response';

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
      const onlineStatusResponse = new OnlineStatusResponse(authResponse.id, true);
      SocketServer.io.emit("online status", onlineStatusResponse);
      res.send(authResponse);
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: number = req.body;
      const user = await this.authService.logoutUser(userId);
      const onlineStatusResponse = new OnlineStatusResponse(user.id, false);
      SocketServer.io.emit("online status", onlineStatusResponse);
      res.send(user);
    } catch (err) {
      next(err);
    }
  }
}

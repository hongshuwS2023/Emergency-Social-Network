import {NextFunction, Request, Response} from 'express';
import UserService from './user.service';
import {UpdateUserInput} from '../requests/updateuser.input';
import UserResponse from '../responses/user.response';

export default class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updateUserInput: UpdateUserInput = req.body;
      const user = await this.userService.updateUser(updateUserInput);
      res.send(user);
    } catch (error) {
      next(error);
    }
  }

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const user = await this.userService.getUser(userId);
      const userResponse = new UserResponse(
        user.id,
        user.username,
        user.status,
        user.onlineStatus,
        user.role,
        user.rooms
      );
      res.send(userResponse);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      await this.userService.deleteUser(userId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

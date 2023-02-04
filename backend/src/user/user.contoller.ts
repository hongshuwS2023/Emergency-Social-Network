import {Request, Response} from 'express';
import {CreateUserInput} from '../requests/createuser.input';
import UserService from './user.service';
import {UpdateUserInput} from '../requests/updateuser.input';

export default class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const createUserInput: CreateUserInput = req.body;
    const user = await this.userService.createUser(createUserInput);

    res.send(user);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const updateUserInput: UpdateUserInput = req.body;

    const user = await this.userService.updateUser(updateUserInput);

    res.send(user);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    console.log(req.params);
    const user = await this.userService.getUser(userId);

    res.send(user);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);

    await this.userService.deleteUser(userId);

    res.sendStatus(200);
  }
}

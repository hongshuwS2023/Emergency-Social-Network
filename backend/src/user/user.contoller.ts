import { Request, Response } from "express";
import { CreateUserDto } from "./dto/createuser.dto";
import UserService from "./user.service";

export default class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const createUserDto: CreateUserDto = req.body;
        const user = await this.userService.createUser(createUserDto);

        res.send(user);
    }
}


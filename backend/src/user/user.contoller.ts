import { Request, Response } from "express";
import MyResponse from "../utils/response";
import { CreateUserDto } from "./dto/createuser.dto";
import UserService from "./user.service";

export default class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        
        const createUserDto: CreateUserDto = req.body;
        const user = await this.userService.createUser(createUserDto);
        
        const response = new MyResponse(JSON.parse("null")).build();
        res.send(response);
    }
}


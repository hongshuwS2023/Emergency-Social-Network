import { Router } from "express"
import UserController from "./user.contoller";

export default class UserRoute {
    router: Router;
    userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();

        this.setRoute();
    }

    private setRoute(): void {
        this.router.post('/', (req, res) => {
            this.userController.createUser(req, res);
        });

    }

    getRouter() {
        return this.router;
    }
}
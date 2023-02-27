import {Router} from 'express';
import MessageController from './message.controller';

export default class MessageRoute {
  router: Router;
  messageController: MessageController;

  constructor() {
    this.router = Router();
    this.messageController = new MessageController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/', (req, res, next) => {
      this.messageController.getMessages(req, res, next);
    });

    this.router.post('/', (req, res, next) => {
      this.messageController.postPublicMessage(req, res, next);
    });
  }
  getRouter() {
    return this.router;
  }
}

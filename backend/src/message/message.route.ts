import {Router} from 'express';
import {PostMessageInput} from '../requests/postmessage.input';
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
    this.router.post('/', async (req, res, next) => {
      try {
        const postMessageInput: PostMessageInput = req.body;
        const message = await this.messageController.postMessage(
          postMessageInput
        );
        res.send(message);
      } catch (err) {
        next(err);
      }
    });
  }
  getRouter() {
    return this.router;
  }
}

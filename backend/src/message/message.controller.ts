import {NextFunction, Request, Response} from 'express';
import MessageService from './message.service';
import { PostMessageInput } from '../requests/postmessage.input';

export default class MessageController {
  messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async getPublicMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const messages = await this.messageService.getPublicMessages();
      res.send(messages);
    } catch (error) {
      next(error);
    }
  }

  async postPublicMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postMessageInput:PostMessageInput = req.body;
      const message = await this.messageService.postMessage(postMessageInput);
      res.send(message);
    } catch (error) {
      next(error);
    }
  }
}

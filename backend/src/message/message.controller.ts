import {NextFunction, Request, Response} from 'express';
import MessageService from './message.service';
import { PostMessageInput } from '../requests/postmessage.input';
import { SocketServer } from '../utils/socketServer';
import MessageResponse from '../responses/api.response';

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
      const postMessageInput: PostMessageInput = req.body;
      const message = await this.messageService.postMessage(postMessageInput);
      const responseMessage = new MessageResponse(message.user.username, message.content, message.time, message.user.status);
      SocketServer.io.emit("public message", responseMessage);
      res.send(responseMessage);
    } catch (error) {
      next(error);
    }
  }
}

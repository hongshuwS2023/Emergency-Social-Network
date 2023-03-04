import {NextFunction, Request, Response} from 'express';
import MessageService from './message.service';
<<<<<<< HEAD
import {PostMessageInput} from '../requests/postmessage.input';
import MessageResponse from '../responses/message.response';
import {SocketServer} from '../utils/socketServer';
=======
import {PostMessageInput} from './dto/postmessage.input';
import {SocketServer} from '../utils/socketServer';
import MessageResponse from './dto/message.response';
>>>>>>> 51a6f4c49ec219fdefb0a2d7e14bf82b2d053e53

export default class MessageController {
  messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async postPublicMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postMessageInput: PostMessageInput = req.body;
      const message = await this.messageService.postMessage(postMessageInput);
      const responseMessage = new MessageResponse(
        message.user.username,
        message.content,
        message.time,
        message.user.status
      );
      SocketServer.emitEvent('public message', responseMessage);
      res.send(responseMessage);
    } catch (error) {
      next(error);
    }
  }
}

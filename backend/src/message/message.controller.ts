import {Repository} from 'typeorm';
import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from '../responses/api.exception';
import {PostMessageInput} from '../requests/postmessage.input';
import ESNDataSource from '../utils/datasource';
import {Message} from './message.entity';
import {User} from '../user/user.entity';
import {getFormattedDate} from '../utils/date';
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import {SocketServer} from '../utils/socketServer';

@Route('/api/messages')
export default class MessageController {
  socketServer: SocketServer;
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;
  roomRepository: Repository<Room>;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
    this.roomRepository = ESNDataSource.getRepository(Room);
  }

  /**
   * Post a new message to the target room
   * @param publicMessageInput
   * @returns Message
   */
  @Post()
  async postMessage(
    @Body() postMessageInput: PostMessageInput
  ): Promise<Message> {
    const user = await this.userRepository.findOneBy({
      id: postMessageInput.userId,
    });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const message = this.messageRepository.create();
    message.content = postMessageInput.content;
    if (postMessageInput.content.trim().length <= 0) {
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }
    const room = await this.roomRepository.findOneBy({
      name: postMessageInput.roomName,
    });
    if (room === null) {
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    message.sender = user;
    message.time = getFormattedDate();

    this.socketServer.broadcastChatMessage(message.room.name, message);
    await this.messageRepository.save(message);
    return message;
  }
}

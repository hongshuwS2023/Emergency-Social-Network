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
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import {SocketServer} from '../utils/socketServer';
import {
  PublicMessageFactory,
  PrivateMessageFactory,
} from '../factory/factory.message';

@Route('/api/messages')
export default class MessageController {
  socketServer: SocketServer;
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;
  roomRepository: Repository<Room>;
  publicMessageFactory: PublicMessageFactory;
  privateMessageFactory: PrivateMessageFactory;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
    this.roomRepository = ESNDataSource.getRepository(Room);
    this.publicMessageFactory = new PublicMessageFactory();
    this.privateMessageFactory = new PrivateMessageFactory();
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
    if (postMessageInput.content.trim().length <= 0) {
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }
    const room = await this.roomRepository.findOne({
      relations: {users: true},
      where: {id: postMessageInput.roomId},
    });
    if (room === null) {
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    let message;
    if (room.id === 'public') {
      message = this.publicMessageFactory.createMessage(
        postMessageInput.content,
        room,
        user
      );
    } else {
      message = this.privateMessageFactory.createMessage(
        postMessageInput.content,
        room,
        user
      );
    }
    this.socketServer.broadcastChatMessage(message.room.id, message);
    await this.messageRepository.save(message);
    return message;
  }
}

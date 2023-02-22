import { Repository } from 'typeorm';
import { BadRequestException, ErrorMessage, NotFoundException } from '../exceptions/api.exception';
import { PostMessageInput } from '../requests/postmessage.input';
import ESNDataSource from '../utils/datasource';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { getFormattedDate } from '../utils/date';
import { Body, Get, Post, Route } from 'tsoa';
import { Room } from '../room/room.entity';

@Route('/api/messages')
export default class MessageService {
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;
  roomRepository: Repository<Room>;

  constructor() {
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
    this.roomRepository = ESNDataSource.getRepository(Room);
  }

  /**
   * Retrieve all messages in the database
   * @returns Message[]
   */
  @Get()
  async getPublicMessages(): Promise<Message[]> {
    const messages = await this.messageRepository.createQueryBuilder('message').leftJoinAndSelect('message.user', 'user').select(['message.content', 'message.time', 'user.username', 'user.status']).getMany();

    if (messages === null) {
      return [];
    }
    return messages;
  }

  /**
   * Post a new message to the target room
   * @param publicMessageInput 
   * @returns Message
   */
  @Post()
  async postMessage(@Body()postMessageInput: PostMessageInput): Promise<Message> {
    const user = await this.userRepository.findOneBy({ id: postMessageInput.userId });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const message = new Message()
    message.content = postMessageInput.content;
    if (postMessageInput.content.trim().length<=0){
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }
    const room = await this.roomRepository.findOneBy({id: postMessageInput.roomId});
    if(room === null){
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    message.room = room;
    message.user = user;
    message.time = getFormattedDate();
    return await this.messageRepository.save(message);
  }

}

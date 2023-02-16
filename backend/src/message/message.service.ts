import { Repository } from 'typeorm';
import { BadRequestException, ErrorMessage, NotFoundException } from '../exceptions/api.exception';
import { PostMessageInput } from '../requests/postmessage.input';
import ESNDataSource from '../utils/datasource';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { getFormattedDate } from '../utils/date';

export default class MessageService {
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;

  constructor() {
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  async getPublicMessages(): Promise<Message[]> {

    // const messages = await this.messageRepository.find({
    //   relations: [
    //     "user"
    //   ],
    //   select: [
    //     "content", "time", "user.username", "user.status"
    //   ],
    //     where:{
    //         room:0
    //     },
    // });

    const messages = await this.messageRepository.createQueryBuilder('message').leftJoinAndSelect('message.user', 'user').select(['message.content', 'message.time', 'user.username', 'user.status']).getMany();

    if (messages === null) {
      return [];
    }
    return messages;
  }

  async postMessage(publicMessageInput: PostMessageInput): Promise<Message> {
    const user = await this.userRepository.findOneBy({ id: publicMessageInput.userId });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const message = new Message()
    message.content = publicMessageInput.content;
    if (publicMessageInput.content.trim().length<=0){
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }
    message.room = publicMessageInput.room || 0;
    message.user = user;
    message.time = getFormattedDate();
    return await this.messageRepository.save(message);
  }

}

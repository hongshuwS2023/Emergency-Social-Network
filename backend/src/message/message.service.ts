import {Repository} from 'typeorm';
import {ErrorMessage, NotFoundException} from '../exceptions/api.exception';
import { PostMessageInput } from '../requests/postmessage.input';
import ESNDataSource from '../utils/datasource';
import {Message} from './message.entity';
import { User } from '../user/user.entity';

export default class MessageService {
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;

  constructor() {
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  async getPublicMessages(): Promise<Message[]> {
    const messages = await this.messageRepository.find({
        where:{
            room:0
        },
    });

    if (messages === null) {
      return [];
    }
    return messages;
  }

  async postMessage(publicMessageInput: PostMessageInput): Promise<Message> {
    const user = await this.userRepository.findOneBy({id: publicMessageInput.userId});
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const message = new Message()
    message.content = publicMessageInput.content;
    message.room = publicMessageInput.room || 0;
    message.user = user;
    message.time = Date.now().toLocaleString();
    return await this.messageRepository.save(message);
  }

}

import {ILike, Repository} from 'typeorm';
import ESNDataSource from '../utils/datasource';
import {Message} from '../message/message.entity';
import {User, Status} from '../user/user.entity';
import {Get, Route} from 'tsoa';
import SearchInput from '../requests/search.input';
import {Context} from '../requests/search.input';
import {BadRequestException, ErrorMessage} from '../responses/api.exception';
import {HistoryStatus} from '../status/status.entity';
import { RESERVED_CRITERIA } from './reserved-criteria';

@Route('/api/search')
export default class SearchController {
  messageRepository: Repository<Message>;
  userRepository: Repository<User>;
  statusRepository: Repository<HistoryStatus>;

  constructor() {
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
    this.statusRepository = ESNDataSource.getRepository(HistoryStatus);
  }

  /**
   * search the information based on passed in context and criteria
   * @param searchInput
   * @returns searchResponse
   */
  @Get()
  async search(searchInput: SearchInput): Promise<string> {
    if(RESERVED_CRITERIA.indexOf(searchInput.criteria) !== -1){
      return 'stop words';
    }
    let response = '';
    switch (searchInput.context) {
      case Context.CITIZENNAME:
        response = JSON.stringify(
          await this.searchUserName(searchInput.criteria)
        );
        break;
      case Context.CITIZENSTATUS:
        response = JSON.stringify(
          await this.searchUserStatus(searchInput.criteria)
        );
        break;
      case Context.PUBLICCHAT:
        response = JSON.stringify(
          await this.searchMessage(searchInput.criteria, 'public')
        );
        break;
      case Context.PRIVATECHAT:
        if (searchInput.criteria === 'status') {
          const history_status: HistoryStatus[] = await this.searchStatus(
            searchInput.criteria,
            searchInput.room_id ? searchInput.room_id : '',
            searchInput.user_id ? searchInput.user_id : ''
          );
          response = JSON.stringify(history_status);
        } else {
          const private_messages: Message[] = await this.searchMessage(
            searchInput.criteria,
            searchInput.room_id ? searchInput.room_id : ''
          );
          response = JSON.stringify(private_messages);
        }
        break;
    }

    return response;
  }

  async searchUserName(criteria: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        username: ILike(`%${criteria}%`),
      },
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });

    return users;
  }

  statusTransition(criteria: string): Status {
    const status = criteria.toUpperCase();
    if (status === 'OK') {
      return Status.OK;
    } else if (status === 'EMERGENCY') {
      return Status.EMERGENCY;
    } else if (status === 'HELP') {
      return Status.HELP;
    } else if (status === 'UNDEFINED') {
      return Status.UNDEFINED;
    } else {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
  }

  async searchUserStatus(criteria: string): Promise<User[]> {
    const searchStatus = this.statusTransition(criteria);
    const users = await this.userRepository.find({
      where: {
        status: searchStatus,
      },
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });
    return users;
  }

  async searchMessage(criteria: string, room_id: string): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      relations: {
        room: true,
        sender: true,
      },
      where: {
        room: {
          id: room_id,
        },
        content: ILike(`%${criteria}%`),
      },
      order: {
        time: 'DESC',
      },
    });
    return messages;
  }

  async searchStatus(
    criteria: string,
    room_id: string,
    user_id: string
  ): Promise<HistoryStatus[]> {
    const user = await this.userRepository.findOneBy({id: user_id});
    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    const userArray: string[] = room_id.split('-');
    const userIndex = userArray.indexOf(user.username);
    if (userIndex === -1) {
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    const otherUser: string = userArray[userIndex === 0 ? 1 : 0];

    const statusHistory = await this.statusRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          username: otherUser,
        },
      },
      order: {
        timeStamp: 'DESC',
      },
      take: 10,
    });
    return statusHistory;
  }
}

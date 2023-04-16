import {ILike, Repository} from 'typeorm';
import ESNDataSource from '../utils/datasource';
import {Message} from '../message/message.entity';
import {User, Status, AccountStatus} from '../user/user.entity';
import {Get, Query, Route} from 'tsoa';
import {Context} from '../requests/search.input';
import {BadRequestException, ErrorMessage} from '../responses/api.exception';
import {HistoryStatus} from '../status/status.entity';
import {RESERVED_CRITERIA} from './reserved-criteria';

export interface SearchResult {
  users?: User[];
  messages?: Message[];
  historyStatus?: HistoryStatus[];
}

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
  async search(
    @Query() criteria: string,
    @Query() context: Context,
    @Query() user_id: string,
    @Query() search_number: number,
    @Query() room_id?: string
  ): Promise<SearchResult> {
    if (RESERVED_CRITERIA.indexOf(criteria) !== -1) {
      throw new BadRequestException(ErrorMessage.BADSEARCHCRITERIA);
    }
    const response: SearchResult = {};
    switch (context) {
      case Context.CITIZENNAME:
        response.users = await this.searchUserName(criteria);
        break;
      case Context.CITIZENSTATUS:
        response.users = await this.searchUserStatus(criteria);
        break;
      case Context.PUBLICCHAT:
        response.messages = await this.searchMessage(
          criteria,
          'public',
          search_number
        );
        break;
      case Context.PRIVATECHAT:
        if (criteria === 'status') {
          const history_status: HistoryStatus[] = await this.searchStatus(
            room_id ? room_id : '',
            user_id ? user_id : '',
            search_number
          );
          response.historyStatus = history_status;
        } else {
          const private_messages: Message[] = await this.searchMessage(
            criteria,
            room_id ? room_id : '',
            search_number
          );
          response.messages = private_messages;
        }
        break;
    }
    return response;
  }

  async searchUserName(criteria: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        username: ILike(`%${criteria}%`),
        accountStatus: AccountStatus.ACTIVE,
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
    } else {
      throw new BadRequestException(ErrorMessage.WRONGSTATUS);
    }
  }

  async searchUserStatus(criteria: string): Promise<User[]> {
    const searchStatus = this.statusTransition(criteria);
    const users = await this.userRepository.find({
      where: {
        status: searchStatus,
        accountStatus: AccountStatus.ACTIVE,
      },
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });
    return users;
  }

  async searchMessage(
    criteria: string,
    room_id: string,
    search_number: number
  ): Promise<Message[]> {
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
        sender: {
          accountStatus: AccountStatus.ACTIVE,
        },
      },
      order: {
        time: 'DESC',
      },
      skip: 10 * (search_number - 1),
      take: 10,
    });
    return messages;
  }

  async searchStatus(
    room_id: string,
    user_id: string,
    search_number: number
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
          accountStatus: AccountStatus.ACTIVE,
        },
      },
      order: {
        timeStamp: 'DESC',
      },
      skip: 10 * (search_number - 1),
      take: 10,
    });
    return statusHistory;
  }
}

import {Repository} from 'typeorm';
import ESNDataSource from '../utils/datasource';
import {Message} from '../message/message.entity';
import {User} from '../user/user.entity';
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import {SocketServer} from '../utils/socketServer';
import SearchInput from '../requests/search.input';
import {Context} from '../requests/search.input';
import searchResponse from '../responses/search.response';

@Route('/api/search')
export default class SearchController {
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
   * search the information based on passed in context and criteria
   * @param searchInput
   * @returns searchResponse
   */
  @Post()
  async search(@Body() searchInput: SearchInput): Promise<searchResponse> {
    switch (searchInput.context) {
      case Context.CITIZENNAME:
        break;
      case Context.CITIZENSTATUS:
        break;
      case Context.ANNOUNCEMENT:
        break;
      case Context.PUBLICCHAT:
        break;
      case Context.PRIVATECHAT:
        break;
    }
    const dummy_data = ['fake'];
    return new searchResponse(JSON.stringify(dummy_data));
  }
}

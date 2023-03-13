import {Repository} from 'typeorm';
import {
  ErrorMessage,
  NotFoundException,
  BadRequestException,
} from '../responses/api.exception';
import ESNDataSource from '../utils/datasource';
import {User} from '../user/user.entity';
import {Body, Get, Post, Route} from 'tsoa';
import {Room} from './room.entity';
import {JoinRoomInput} from '../requests/joinroom.input';
import {SocketServer} from '../utils/socketServer';
@Route('/api/rooms')
export default class RoomController {
  roomRepository: Repository<Room>;
  userRepository: Repository<User>;
  socketServer: SocketServer;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.roomRepository = ESNDataSource.getRepository(Room);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Retrieve the room with all the related messages in the database
   * @param roomId
   * @returns Room
   */
  @Get('{roomId}')
  async getRoom(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      relations: {
        messages: true,
        users: true,
      },
      where: {
        id: roomId,
      },
    });

    if (room === null) {
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }

    room.messages;
    return room;
  }

  /**
   * Join a room, if not exist then create
   * @param joinRoomInput
   * @returns Room
   */
  @Post()
  async joinRoom(@Body() joinRoomInput: JoinRoomInput): Promise<Room> {
    const users: User[] = [];
    const user_names: string[] = [];
    for (const userId of joinRoomInput.idList) {
      const user = await this.userRepository.findOneBy({id: userId});
      if (user === null) {
        throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
      }
      users.push(user);
      user_names.push(user.username);
    }
    user_names.sort();
    const room_id = user_names.join('-');
    // connect sockets to room
    for (const userId of joinRoomInput.idList) {
      this.socketServer.joinRoom(userId, room_id);
    }
    const room = await this.roomRepository.findOneBy({id: room_id});
    if (room === null) {
      const newRoom = this.roomRepository.create();
      newRoom.id = room_id;
      newRoom.users = users;
      return await this.roomRepository.save(newRoom);
    }
    return room;
  }
}

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
import {v4 as uuid} from 'uuid';
@Route('/api/rooms')
export default class RoomController {
  roomRepository: Repository<Room>;
  userRepository: Repository<User>;

  constructor() {
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
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
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

    for (const userId of joinRoomInput.idList) {
      const user = await this.userRepository.findOneBy({id: userId});
      if (user === null) {
        throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
      }

      users.push(user);
    }

    const room = this.roomRepository.create();

    room.id = uuid();
    room.users = users;

    // Broadcast room Id to users and connect sockets to room

    return await this.roomRepository.save(room);
  }
}

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
   * @param roomName
   * @returns Room
   */
  @Get('{roomName}')
  async getRoom(roomName: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      relations: {
        messages: true,
        users: true,
      },
      where: {
        name: roomName,
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
    const user1 = await this.userRepository.findOneBy({
      id: joinRoomInput.idList[0],
    });
    if (user1 === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const user2 = await this.userRepository.findOneBy({
      id: joinRoomInput.idList[1],
    });
    if (user2 === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    const roomName1 = user1.username + '-' + user2.username;
    const roomName2 = user2.username + '-' + user1.username;
    let room =
      (await this.roomRepository.findOneBy({name: roomName1})) ||
      (await this.roomRepository.findOneBy({name: roomName2}));
    if (room === null) {
      room = new Room();
      room.name = roomName1;
    }
    room.users = [user1, user2];
    return await this.roomRepository.save(room);
  }
}

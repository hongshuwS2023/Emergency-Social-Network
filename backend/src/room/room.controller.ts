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
    console.log(roomName);
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
    let room = await this.roomRepository.findOneBy({name: joinRoomInput.name});
    if (room === null) {
      room = new Room();
    }
    const user = await this.userRepository.findOneBy({
      id: joinRoomInput.userId,
    });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    room.users.push(user);
    return await this.roomRepository.save(room);
  }
}

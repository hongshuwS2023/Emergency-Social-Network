import {Repository, Not} from 'typeorm';
import {
  ErrorMessage,
  NotFoundException,
  BadRequestException,
} from '../responses/api.exception';
import ESNDataSource from '../utils/datasource';
import {AccountStatus, User} from '../user/user.entity';
import {Body, Get, Post, Put, Route} from 'tsoa';
import {Room} from './room.entity';
import {JoinRoomInput} from '../requests/joinroom.input';
import {SocketServer} from '../utils/socketServer';
import {Message} from '../message/message.entity';
import {CreateChatGroupInput} from '../requests/createchatgroup.input';
import {UpdateChatGroupInput} from '../requests/updatechatgroup.input';
import {RoomType} from './room.entity';
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
      relations: ['messages', 'messages.sender', 'users'],
      where: {
        id: roomId,
      },
    });
    if (room === null) {
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    room.messages.sort(
      (a: Message, b: Message) => Number(a.time) - Number(b.time)
    );

    return room;
  }

  /**
   * Retrieve all the chatGroups from the database
   * @returns Rooms that are chatGroups
   */
  @Get()
  async getChatGroup(): Promise<Room[]> {
    const rooms = await this.roomRepository.find({
      relations: ['messages', 'messages.sender', 'users'],
      where: {
        type: Not(RoomType.UNDEFINED),
        users: {
          accountStatus: AccountStatus.ACTIVE,
        },
      },
    });
    rooms.sort((a: Room, b: Room) => a.id.localeCompare(b.id));

    return rooms;
  }

  /**
   * Create and join a private chat room
   * @param joinRoomInput
   * @returns Room
   */
  @Post()
  async joinRoom(@Body() joinRoomInput: JoinRoomInput): Promise<Room> {
    const users: User[] = [];
    const user_names: string[] = [];

    for (const userId of joinRoomInput.idList) {
      const user = await this.userRepository.findOneBy({
        id: userId,
        accountStatus: AccountStatus.ACTIVE,
      });
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

  /**
   * Create a group chat room
   * @param createChatGroupInput
   * @returns Room
   */
  @Post('chatgroup')
  async createGroupChat(
    @Body() createChatGroupInput: CreateChatGroupInput
  ): Promise<Room> {
    const users: User[] = [];
    const user = await this.userRepository.findOneBy({
      id: createChatGroupInput.userId,
      accountStatus: AccountStatus.ACTIVE,
    });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    users.push(user);
    const room_id = createChatGroupInput.roomId;
    // connect sockets to room
    this.socketServer.joinRoom(createChatGroupInput.userId, room_id);
    const newRoom = this.roomRepository.create();
    newRoom.id = room_id;
    newRoom.users = users;
    newRoom.type = createChatGroupInput.type;
    return await this.roomRepository.save(newRoom);
  }

  /**
   * Join or leave a group chat room
   * @param createChatGroupInput
   * @returns Room
   */
  @Put('{roomId}')
  async updateGroupChat(
    roomId: string,
    @Body() updateChatGroupInput: UpdateChatGroupInput
  ): Promise<Room> {
    const room = await this.roomRepository.findOne({
      relations: ['users'],
      where: {
        id: roomId,
        users: {
          accountStatus: AccountStatus.ACTIVE,
        },
      },
    });
    if (room === null) {
      throw new BadRequestException(ErrorMessage.ROOMIDNOTFOUND);
    }
    const users: User[] = room.users;
    const user = await this.userRepository.findOneBy({
      id: updateChatGroupInput.userId,
    });
    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    if (updateChatGroupInput.isJoin) {
      if (users.findIndex(element => element.id === user.id) === -1) {
        users.push(user);
        this.socketServer.joinRoom(updateChatGroupInput.userId, roomId);
        room.users = users;
        return await this.roomRepository.save(room);
      }
    } else {
      const index = users.findIndex(element => element.id === user.id);
      if (index < 0) {
        throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
      } else {
        users.splice(index, 1);
        this.socketServer.leaveRoom(updateChatGroupInput.userId, roomId);
        room.users = users;
        return await this.roomRepository.save(room);
      }
    }
    return room;
  }
}

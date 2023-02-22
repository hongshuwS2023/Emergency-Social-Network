import {Get, Query, Route} from 'tsoa';
import {Repository} from 'typeorm';
import {ErrorMessage, NotFoundException} from '../exceptions/api.exception';
import ESNDataSource from '../utils/datasource';
import {Room} from './room.entity';

@Route('/api/rooms')
export default class RoomService {
  roomRepository: Repository<Room>;

  constructor() {
    this.roomRepository = ESNDataSource.getRepository(Room);
  }

  /**
   * Get all the info of the room based on the roomId provided
   * @param roomId
   * @returns room entity
   */
  @Get('{roomId}')
  async getRoom(@Query() roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOneBy({roomId: roomId});

    if (room === null) {
      throw new NotFoundException(ErrorMessage.ROOMNOTFOUND);
    }

    return room;
  }
}

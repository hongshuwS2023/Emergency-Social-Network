import {Body, Delete, Get, Post, Put, Route} from 'tsoa';
import {Repository} from 'typeorm';
import {ErrorMessage, NotFoundException} from '../responses/api.exception';
import {CreateSpeedTestInput} from '../requests/createspeedtest.input';
import {User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import {SpeedTest} from './speedtest.entity';
import {Room} from '../room/room.entity';
import CreateSpeedTestResponse from '../responses/speedtest.response';
import {SpeedTestMiddleware} from '../middleware/speedtest.middleware';
import {v4 as uuid} from 'uuid';
import {getFormattedDate} from '../utils/date';
import {Message} from '../message/message.entity';

@Route('/api/speedtests')
export default class SpeedtestService {
  private speedTestRepository: Repository<SpeedTest>;
  private userRepository: Repository<User>;
  private roomRepository: Repository<Room>;
  private messageRepository: Repository<Message>;
  constructor() {
    this.speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    this.roomRepository = ESNDataSource.getRepository(Room);
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Start a speed test session.
   * @param createSpeedTestInput
   * @returns createSpeedTestResponse
   */
  @Post()
  async createSpeedTest(
    @Body() createSpeedTestInput: CreateSpeedTestInput
  ): Promise<CreateSpeedTestResponse> {
    const {adminId, interval, duration} = createSpeedTestInput;
    const speedTest = this.speedTestRepository.create();

    const user = await this.userRepository.findOneBy({id: adminId});
    const room = this.roomRepository.create();

    if (!user) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    SpeedTestMiddleware.getInstance().setUserId(adminId);

    room.id = 'speedtest';
    room.users = [user];

    await this.roomRepository.save(room);

    speedTest.id = uuid();
    speedTest.admin = user;
    speedTest.interval = interval;
    speedTest.duration = duration;
    speedTest.startTime = getFormattedDate();

    await this.speedTestRepository.save(speedTest);

    SpeedTestMiddleware.getInstance().setUserId(user.id);

    return new CreateSpeedTestResponse(speedTest.id, room.id);
  }

  /**
   * Start a speed test session
   * @param speed test id
   * @returns speedtest entity
   */
  @Put('{speedtestId}')
  async startSpeedTest(speedtestId: string): Promise<SpeedTest> {
    const speedtest = await this.speedTestRepository.findOneBy({
      id: speedtestId,
    });

    if (!speedtest) {
      throw new NotFoundException(ErrorMessage.SPEEDTESTNOTFOUND);
    }

    speedtest.startTime = new Date().toISOString();

    return await this.speedTestRepository.save(speedtest);
  }

  /**
   * Stop a speed test session
   * @param speed test id
   * @returns speedtest entity
   */
  @Delete('{speedtestId}')
  async stopSpeedTest(speedtestId: string): Promise<string> {
    const messages = await this.messageRepository.find({
      relations: {
        room: true,
      },
      where: {
        room: {
          id: 'speedtest',
        },
      },
    });
    await this.messageRepository.remove(messages);
    const room = await this.roomRepository.findOneBy({id: 'speedtest'});
    if (room !== null) {
      await this.roomRepository.remove(room);
    }
    await this.speedTestRepository.delete(speedtestId);
    SpeedTestMiddleware.getInstance().reset();
    return 'succeed';
  }

  /**
   * Start a speed test session
   * @param speed test id
   * @returns speedtest entity
   */
  @Get('{speedtestId}')
  async getSpeedTest(speedtestId: string): Promise<SpeedTest> {
    const speedtest = await this.speedTestRepository.findOneBy({
      id: speedtestId,
    });

    if (!speedtest) {
      throw new NotFoundException(ErrorMessage.SPEEDTESTNOTFOUND);
    }
    const stats = SpeedTestMiddleware.getInstance().getStats();
    speedtest.postRate = stats[0] / speedtest.duration;
    speedtest.getRate = stats[1] / speedtest.duration;
    SpeedTestMiddleware.getInstance().reset();
    const messages = await this.messageRepository.find({
      relations: {
        room: true,
      },
      where: {
        room: {
          id: 'speedtest',
        },
      },
    });
    await this.messageRepository.remove(messages);
    const room = await this.roomRepository.findOneBy({id: 'speedtest'});
    if (room !== null) {
      await this.roomRepository.remove(room);
    }
    return await this.speedTestRepository.save(speedtest);
  }
}

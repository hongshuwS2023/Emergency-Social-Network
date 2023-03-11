import {Body, Post, Put, Route} from 'tsoa';
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

@Route('/api/speedtests')
export default class SpeedtestService {
  private speedTestRepository: Repository<SpeedTest>;
  private userRepository: Repository<User>;
  private roomRepository: Repository<Room>;
  constructor() {
    this.speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    this.roomRepository = ESNDataSource.getRepository(Room);
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

    room.id = 'speedtest';
    room.users.push(user);

    await this.roomRepository.save(room);

    speedTest.id = uuid();
    speedTest.admin = user;
    speedTest.interval = interval;
    speedTest.duration = duration;

    await this.speedTestRepository.save(speedTest);

    SpeedTestMiddleware.getInstance().setUserId(user.id);
    return new CreateSpeedTestResponse(speedTest.id, room.id);
  }

  /**
   * Stop a speed test session
   * @param speed test id
   * @returns speedtest entity
   */
  @Put('{speedtestId}')
  async stopSpeedTest(speedtestId: string): Promise<SpeedTest> {
    const speedtest = await this.speedTestRepository.findOneBy({
      id: speedtestId,
    });

    if (!speedtest) {
      throw new NotFoundException(ErrorMessage.SPEEDTESTNOTFOUND);
    }

    const [numGetRequests, numPostRequests] =
      SpeedTestMiddleware.getInstance().getStats();

    speedtest.postRate = numPostRequests / speedtest.interval;
    speedtest.getRate = numGetRequests / speedtest.interval;

    SpeedTestMiddleware.getInstance().reset();
    return await this.speedTestRepository.save(speedtest);
  }
}
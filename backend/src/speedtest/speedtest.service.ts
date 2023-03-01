import {Body, Post, Put, Route} from 'tsoa';
import {Repository} from 'typeorm';
import {ErrorMessage, NotFoundException} from '../exceptions/api.exception';
import {Message} from '../message/message.entity';
import {CreateSpeedTestInput} from '../requests/createspeedtest.input';
import {User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import {SpeedTest} from './speedtest.entity';

@Route('/api/speedtest')
export default class SpeedtestService {
  private speedTestRepository: Repository<SpeedTest>;
  private messageRepository: Repository<Message>;
  private userRepository: Repository<User>;

  constructor() {
    this.speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    this.messageRepository = ESNDataSource.getRepository(Message);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Start a speed test session.
   * @param createSpeedTestInput
   * @returns speedtest entity
   */
  @Post()
  async createSpeedTest(
    @Body() createSpeedTestInput: CreateSpeedTestInput
  ): Promise<SpeedTest> {
    const {adminId, interval} = createSpeedTestInput;

    const speedTest = new SpeedTest();

    const user = await this.userRepository.findOneBy({id: adminId});

    if (!user) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    speedTest.admin = user;
    speedTest.interval = interval;

    return await this.speedTestRepository.save(speedTest);
  }

  /**
   * Stop a speed test session
   * @param speed test id
   * @returns speedtest entity
   */
  @Put('{speedtestid}')
  async stopSpeedTest(speedtestId: number): Promise<SpeedTest> {
    const speedtest = await this.speedTestRepository.findOneBy({
      id: speedtestId,
    });

    if (!speedtest) {
      throw new NotFoundException(ErrorMessage.SPEEDTESTNOTFOUNT);
    }

    speedtest.onGoing = false;

    return await this.speedTestRepository.save(speedtest);
  }
}

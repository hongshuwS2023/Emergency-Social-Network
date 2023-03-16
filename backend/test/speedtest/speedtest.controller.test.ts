import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import {Room} from '../../src/room/room.entity';
import SpeedtestService from '../../src/speedtest/speedtest.controller';
import CreateSpeedTestResponse from '../../src/responses/speedtest.response';
import {SpeedTest} from '../../src/speedtest/speedtest.entity';

const speedtestController = new SpeedtestService();
const userRepository = ESNDataSource.getRepository(User);

beforeEach(async () => {
  await ESNDataSource.initialize();
  const user = userRepository.create();
  user.id = 'test_id';
  user.username = 'test_username';
  user.password = 'test_password';
  user.role = 0;
  user.status = 0;
  user.onlineStatus = 0;
  user.statusTimeStamp = new Date().getTime().toString();
  user.logoutTime = '';
  await userRepository.save(user);
  const roomRepository = ESNDataSource.getRepository(Room);
  const room = roomRepository.create();
  room.id = 'speedtest';
  await roomRepository.save(room);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('createSpeedTest', () => {
  it('Should successfully create a speedtest middleware instance', async () => {
    const createSpeedTestInput = {
      adminId: 'test_id',
      interval: 300,
      duration: 300,
    };
    const createSpeedTestResponse: CreateSpeedTestResponse =
      await speedtestController.createSpeedTest(createSpeedTestInput);
    expect(createSpeedTestResponse.room_id).toBe('speedtest');
  });

  it('Should fail to create a speedtest middleware instance if input admin id is invalid', async () => {
    // Case admin id is invalid
    const createSpeedTestInput = {
      adminId: 'invalid_id',
      interval: 300,
      duration: 300,
    };
    try {
      await speedtestController.createSpeedTest(createSpeedTestInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('startSpeedTest', () => {
  it('Should successfully start a new speedtest', async () => {
    const speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    const speedTest = speedTestRepository.create();
    speedTest.id = 'test_id';
    speedTest.duration = 300;
    speedTest.interval = 300;
    speedTest.startTime = new Date().getTime().toString();
    await speedTestRepository.save(speedTest);
    const res = await speedtestController.startSpeedTest('test_id');
    expect(Number(res.startTime)).toBeGreaterThanOrEqual(
      Number(speedTest.startTime)
    );
  });

  it('Should fail to start the speedtest if the speedtest id is invalid', async () => {
    // Case speedtest id is invalid
    try {
      await speedtestController.startSpeedTest('invalid_id');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.SPEEDTESTNOTFOUND
      );
    }
  });
});

describe('deleteSpeedTest', () => {
  it('Should successfully delete the speedtest', async () => {
    const speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    const speedTest = speedTestRepository.create();
    speedTest.id = 'test_id';
    speedTest.duration = 300;
    speedTest.interval = 300;
    speedTest.startTime = new Date().getTime().toString();
    await speedTestRepository.save(speedTest);
    const res = await speedtestController.stopSpeedTest('test_id');
    expect(res).toBe('succeed');
  });
});

describe('getSpeedTest', () => {
  it('Should successfully get the speedtest', async () => {
    const speedTestRepository = ESNDataSource.getRepository(SpeedTest);
    const speedTest = speedTestRepository.create();
    speedTest.id = 'test_id';
    speedTest.duration = 300;
    speedTest.interval = 300;
    speedTest.startTime = new Date().getTime().toString();
    await speedTestRepository.save(speedTest);
    const res = await speedtestController.getSpeedTest('test_id');
    expect(res.id).toBe('test_id');
  });

  it('Should fail to get the speedtest if the speedtest id is invalid', async () => {
    // Case speedtest id is invalid
    try {
      await speedtestController.getSpeedTest('invalid_id');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.SPEEDTESTNOTFOUND
      );
    }
  });
});

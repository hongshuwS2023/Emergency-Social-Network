import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import RoomController from '../../src/room/room.controller';
import {Room} from '../../src/room/room.entity';

const roomController = new RoomController();
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
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('joinRoom', () => {
  it('Should successfully create a room', async () => {
    const user =
      (await userRepository.findOneBy({
        id: 'test_id',
      })) || new User();

    const joinRoomInput = {
      idList: [user.id],
    };
    const room = await roomController.joinRoom(joinRoomInput);
    expect(room.users).not.toBeNull();
    expect(room.id).toBe(user.username);
  });

  it('Should not create a room when the room already exists', async () => {
    const roomRepository = ESNDataSource.getRepository(Room);
    const room = roomRepository.create();
    room.id = 'test_username';
    await roomRepository.save(room);
    const user =
      (await userRepository.findOneBy({
        id: 'test_id',
      })) || new User();

    const joinRoomInput = {
      idList: [user.id],
    };
    const newRoom = await roomController.joinRoom(joinRoomInput);
    expect(newRoom.id).toBe(room.id);
  });

  it('Should fail to create a room if input user id is invalid', async () => {
    // Case user id is invalid
    const invalidJoinRoomInput = {
      idList: ['invalid id'],
    };
    try {
      await roomController.joinRoom(invalidJoinRoomInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('getRoom', () => {
  it('Should successfully get the room', async () => {
    const roomRepository = ESNDataSource.getRepository(Room);
    const room = roomRepository.create();
    room.id = 'test_username';
    await roomRepository.save(room);
    const getRoom = await roomController.getRoom('test_username');
    expect(getRoom.id).toBe(room.id);
  });

  it('Should fail to get the room if the room id is invalid', async () => {
    // Case room id is invalid
    try {
      await roomController.getRoom('invalid_room_id');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.ROOMIDNOTFOUND
      );
    }
  });
});

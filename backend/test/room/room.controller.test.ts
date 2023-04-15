import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import RoomController from '../../src/room/room.controller';
import {Room, RoomType} from '../../src/room/room.entity';

const roomController = new RoomController();
const roomRepository = ESNDataSource.getRepository(Room);
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
  const room = roomRepository.create();
  room.id = 'test_group1';
  room.type = RoomType.SEARCH;
  await roomRepository.save(room);
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

describe('create chat group', () => {
  it('Should successfully create the room', async () => {
    const createGroupInput = {
      userId: 'test_id',
      roomId: 'test_group',
      type: RoomType.EXCAVATE,
    };
    const res = await roomController.createGroupChat(createGroupInput);
    expect(res.id).toBe('test_group');
  });

  it('Should fail to create the chat group if the provided user id is invalid', async () => {
    // Case room id is invalid
    try {
      const createGroupInput = {
        userId: 'wrong_id',
        roomId: 'test_group',
        type: RoomType.EXCAVATE,
      };
      await roomController.createGroupChat(createGroupInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('get all chat group', () => {
  it('Should successfully get all the rooms that are chat groups', async () => {
    const createGroupInput = {
      userId: 'test_id',
      roomId: 'test_group',
      type: RoomType.EXCAVATE,
    };
    await roomController.createGroupChat(createGroupInput);
    const rooms = await roomController.getChatGroup();
    expect(rooms[0].id).toBe('test_group');
  });
});

describe('update the group chat, joining or leaving a group', () => {
  it('Should let a user successfully join a room', async () => {
    const updateGroupInput = {
      userId: 'test_id',
      isJoin: true,
    };
    const res = await roomController.updateGroupChat(
      'test_group1',
      updateGroupInput
    );
    expect(res.users[0].id).toBe('test_id');
  });

  it('Should fail to join a group if the group cannot be found', async () => {
    // Case room id is invalid
    try {
      const updateGroupInput = {
        userId: 'test_id',
        isJoin: true,
      };
      await roomController.updateGroupChat('wrong_group1', updateGroupInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.ROOMIDNOTFOUND
      );
    }
  });

  it('Should fail to join a group if the user cannot be found', async () => {
    // Case room id is invalid
    try {
      const updateGroupInput = {
        userId: 'wrong_id',
        isJoin: true,
      };
      await roomController.updateGroupChat('test_group1', updateGroupInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });

  it('Should let a user successfully leave a room', async () => {
    const updateGroupInput = {
      userId: 'test_id',
      isJoin: true,
    };
    await roomController.updateGroupChat('test_group1', updateGroupInput);
    const leaveGroupInput = {
      userId: 'test_id',
      isJoin: false,
    };
    const leaveRes = await roomController.updateGroupChat(
      'test_group1',
      leaveGroupInput
    );
    expect(leaveRes.users.length).toBe(0);
  });

  it('Should fail to leave if the user cannot be found', async () => {
    // Case room id is invalid
    try {
      const leaveGroupInput = {
        userId: 'test_id',
        isJoin: false,
      };
      await roomController.updateGroupChat('test_group1', leaveGroupInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });

  it('Should not modified the chat group if the user that want to join is already in the group', async () => {
    const updateGroupInput = {
      userId: 'test_id',
      isJoin: true,
    };
    await roomController.updateGroupChat('test_group1', updateGroupInput);
    const res = await roomController.updateGroupChat(
      'test_group1',
      updateGroupInput
    );
    expect(res.users.length).toBe(1);
  });
});

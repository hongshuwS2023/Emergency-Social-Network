import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import {Room} from '../../src/room/room.entity';
import SearchController from '../../src/search/search.controller';
import {Message} from '../../src/message/message.entity';
import {HistoryStatus} from '../../src/status/status.entity';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';

const searchController = new SearchController();
const userRepository = ESNDataSource.getRepository(User);
const roomRepository = ESNDataSource.getRepository(Room);
const messageRepository = ESNDataSource.getRepository(Message);
const statusRepository = ESNDataSource.getRepository(HistoryStatus);

beforeEach(async () => {
  await ESNDataSource.initialize();
  const user1 = userRepository.create();
  user1.id = 'user1_id';
  user1.username = 'user1';
  user1.password = 'user1_password';
  user1.role = 0;
  user1.status = 0;
  user1.onlineStatus = 0;
  user1.statusTimeStamp = new Date().getTime().toString();
  user1.logoutTime = '';
  await userRepository.save(user1);
  const user2 = userRepository.create();
  user2.id = 'user2_id';
  user2.username = 'user2';
  user2.password = 'user2_password';
  user2.role = 0;
  user2.status = 2;
  user2.onlineStatus = 0;
  user2.statusTimeStamp = new Date().getTime().toString();
  user2.logoutTime = '';
  await userRepository.save(user2);
  const publicRoom = roomRepository.create();
  publicRoom.users = [user1, user2];
  publicRoom.id = 'public';
  await roomRepository.save(publicRoom);
  const privateRoom = roomRepository.create();
  privateRoom.users = [user1, user2];
  privateRoom.id = 'user1-user2';
  await roomRepository.save(privateRoom);
  const publicMessage = messageRepository.create();
  publicMessage.content = 'public test message';
  publicMessage.id = 'public-message';
  publicMessage.sender = user1;
  publicMessage.status = user1.status;
  publicMessage.time = new Date().getTime().toString();
  publicMessage.room = publicRoom;
  await messageRepository.save(publicMessage);
  const privateMessage = messageRepository.create();
  privateMessage.content = 'private test message';
  privateMessage.id = 'private-message';
  privateMessage.sender = user2;
  privateMessage.status = user2.status;
  privateMessage.time = new Date().getTime().toString();
  privateMessage.room = privateRoom;
  await messageRepository.save(privateMessage);
  const status1 = statusRepository.create();
  status1.user = user1;
  status1.id = 'status1';
  status1.status = user1.status;
  status1.timeStamp = String(new Date().getTime());
  await statusRepository.save(status1);
  const status2 = statusRepository.create();
  status2.user = user2;
  status2.id = 'status2';
  status2.status = user2.status;
  status2.timeStamp = String(new Date().getTime());
  await statusRepository.save(status2);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('searchInformation', () => {
  it('should get the user by its name', async () => {
    const searchInformationInput = {
      context: 0,
      criteria: 'user1',
      user_id: 'user1_id',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].id).toBe('user1_id');
    expect(data[0].username).toBe('user1');
  });

  it('should get the user by its status', async () => {
    const searchInformationInput = {
      context: 1,
      criteria: 'UNDEFINED',
      user_id: 'user1_id',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].id).toBe('user1_id');
    expect(data[0].username).toBe('user1');
  });

  it('should throw an exception if the criteria of status name is wrong', async () => {
    // Case status criteria is invalid
    const searchInformationInput = {
      context: 1,
      criteria: 'badstatus',
      user_id: 'user1_id',
    };
    try {
      await searchController.search(searchInformationInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGSTATUS
      );
    }
  });

  it('should get the public message by the content', async () => {
    const searchInformationInput = {
      context: 3,
      criteria: 'public test message',
      user_id: 'user1_id',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].id).toBe('public-message');
    expect(data[0].content).toBe('public test message');
  });

  it('should get the private message by the content', async () => {
    const searchInformationInput = {
      context: 4,
      criteria: 'private test message',
      user_id: 'user1_id',
      room_id: 'user1-user2',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].id).toBe('private-message');
    expect(data[0].content).toBe('private test message');
  });

  it('should get the private message by the content', async () => {
    const searchInformationInput = {
      context: 4,
      criteria: 'private test message',
      user_id: 'user1_id',
      room_id: 'user1-user2',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].id).toBe('private-message');
    expect(data[0].content).toBe('private test message');
  });

  it('should get the status of the other user by using criteria status in the private chat', async () => {
    const searchInformationInput = {
      context: 4,
      criteria: 'status',
      user_id: 'user2_id',
      room_id: 'user1-user2',
    };
    const res = await searchController.search(searchInformationInput);

    const data = JSON.parse(res);
    expect(data[0].status).toBe(0);
    expect(data[0].user.id).toBe('user1_id');
  });

  it('should throw an exception if the user_id in search private chat status is wrong', async () => {
    // Case user id is invalid
    const searchInformationInput = {
      context: 4,
      criteria: 'status',
      user_id: 'badUser',
      room_id: 'user1-user2',
    };
    try {
      await searchController.search(searchInformationInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });

  it('should throw an exception if the room_id in search private chat status is wrong', async () => {
    // Case room id is invalid
    const searchInformationInput = {
      context: 4,
      criteria: 'status',
      user_id: 'user2_id',
      room_id: 'bad room',
    };
    try {
      await searchController.search(searchInformationInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.ROOMIDNOTFOUND
      );
    }
  });
  it('should throw an error if the criteria in search is in stop words list', async () => {
    // Case criteria is a stop words
    const searchInformationInput = {
      context: 0,
      criteria: 'able',
      user_id: 'user2_id',
    };
    try {
      await searchController.search(searchInformationInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADSEARCHCRITERIA
      );
    }
  });
});

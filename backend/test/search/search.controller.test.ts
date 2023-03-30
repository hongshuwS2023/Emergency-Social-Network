import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import {Room} from '../../src/room/room.entity';
import SearchController from '../../src/search/search.controller';
import {Message} from '../../src/message/message.entity';
import {HistoryStatus} from '../../src/status/status.entity';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import { Context } from '../../src/requests/search.input';

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
    const res = await searchController.search('user1',1,'user1_id');
    expect(res.users).not.toBeNull();
    console.log(res);
    res.users = res.users?res.users:[];
    console.log(res.users);
    
    expect(res.users[0].id).toBe('user1_id');
    expect(res.users[0].username).toBe('user1');
  });

  it('should get the user by its status', async () => {
    const res = await searchController.search('UNDEFINED',2,'user1_id');
    expect(res.users).not.toBeNull();
    res.users = res.users?res.users:[];
    expect(res.users[0].id).toBe('user1_id');
    expect(res.users[0].username).toBe('user1');
  });

  it('should throw an exception if the criteria of status name is wrong', async () => {
    // Case status criteria is invalid
    try {
      await searchController.search('badstatus', 1, 'user1_id', 'room');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGSTATUS
      );
    }
  });

  it('should get the public message by the content', async () => {
    const res = await searchController.search('public test message', 3, 'user1_id', 'room');
    expect(res.messages).not.toBeNull();
    res.messages = res.messages?res.messages:[];
    expect(res.messages[0].id).toBe('public-message');
    expect(res.messages[0].content).toBe('public test message');
  });

  it('should get the private message by the content', async () => {
    const res = await searchController.search('private test message', 4, 'user1_id', 'user1-user2');
    expect(res.messages).not.toBeNull();
    res.messages = res.messages?res.messages:[];
    expect(res.messages[0].id).toBe('private-message');
    expect(res.messages[0].content).toBe('private test message');
  });

  it('should get the private message by the content', async () => {
    const res = await searchController.search('private test message', 4,'user1_id', 'user1-user2' );
    expect(res.messages).not.toBeNull();
    res.messages = res.messages?res.messages:[];
    expect(res.messages[0].id).toBe('private-message');
    expect(res.messages[0].content).toBe('private test message');
  });

  it('should get the status of the other user by using criteria status in the private chat', async () => {
    const res = await searchController.search('status', 4,'user2_id',  'user1-user2');
    expect(res.historyStatus).not.toBeNull();
    res.historyStatus = res.historyStatus?res.historyStatus:[];
    expect(res.historyStatus[0].status).toBe(0);
    expect(res.historyStatus[0].user.id).toBe('user1_id');
  });

  it('should throw an exception if the user_id in search private chat status is wrong', async () => {
    // Case user id is invalid
    try {
      await searchController.search('status', 4, 'badUser','user1-user2' );
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });

  it('should throw an exception if the room_id in search private chat status is wrong', async () => {
    // Case room id is invalid
    try {
      await searchController.search('status', 4, 'user2_id','bad room' );
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.ROOMIDNOTFOUND
      );
    }
  });
  it('should throw an error if the criteria in search is in stop words list', async () => {
    // Case criteria is a stop words
    try {
      await searchController.search('able', 0, 'user2_id', 'room');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADSEARCHCRITERIA
      );
    }
  });
});

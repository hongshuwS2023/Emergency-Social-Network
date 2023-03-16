import AuthController from '../../src/auth/auth.controller';
import MessageController from '../../src/message/message.controller';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import { Room } from '../../src/room/room.entity';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';

const messageController = new MessageController();
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
  room.id = 'public';
  await roomRepository.save(room);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('postMessage', () => {
  it('Should successfully send the message', async () => {
    const postMessageInput = {
      userId: 'test_id',
      content: 'hello',
      roomId: 'public',
    };
    expect(
      await messageController.postMessage(postMessageInput)
    ).not.toBeNull();
  });

  it('Should not send messages if input is invalid', async () => {

    // Case user id is invalid
    const invalidUserIdMessageInput = {
      userId: 'invalid id',
      content: 'hello',
      roomId: 'public',
    };

    try {
      await messageController.postMessage(invalidUserIdMessageInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }

    // Case message is empty
    const emptyMessageInput = {
      userId: 'test_id',
      content: '',
      roomId: 'public',
    };

    try {
      await messageController.postMessage(emptyMessageInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.EMPTYMESSAGE
      );
    }

    // Case room is not valid
    const invalidRoomMessageInput = {
      userId: 'test_id',
      content: 'hello',
      roomId: 'invalid room',
    };

    try {
      await messageController.postMessage(invalidRoomMessageInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.ROOMIDNOTFOUND
      );
    }
  });
});

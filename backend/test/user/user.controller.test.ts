import UserController from '../../src/user/user.controller';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import {OnlineStatus, Role, Status, User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import {Room} from '../../src/room/room.entity';

const userController = new UserController();

beforeEach(async () => {
  await ESNDataSource.initialize();
  const userRepository = ESNDataSource.getRepository(User);
  const roomRepository = ESNDataSource.getRepository(Room);
  const room = roomRepository.create();
  room.id = 'public';
  await roomRepository.save(room);
  const user = userRepository.create();
  user.rooms = [room];
  user.username = 'test_username';
  user.password = 'test_password';
  user.id = 'test_id';
  await userRepository.save(user);

  const user_2 = userRepository.create();
  user_2.username = 'test_username_2';
  user_2.password = 'test_password_2';
  user_2.id = 'test_id_2';
  user_2.rooms = [room];
  await userRepository.save(user_2);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('getUser', () => {
  it('Should return the correct user', async () => {
    const userRepository = ESNDataSource.getRepository(User);
    const user = await userRepository.findOne({
      relations: ['rooms', 'speedtests'],
      where: {
        id: 'test_id',
      },
    });

    expect(await userController.getUser('test_id')).toEqual(user);
  });

  it('Should throw an error if user does not exist in database', async () => {
    try {
      await userController.getUser('invalid id');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('getUsers', () => {
  it('Should return all users', async () => {
    const userRepository = ESNDataSource.getRepository(User);
    const users =
      (await userRepository.find({
        order: {
          onlineStatus: 'ASC',
          username: 'ASC',
        },
      })) || [];

    expect(await userController.getUsers()).toEqual(users);
  });
});

describe('updateUser', () => {
  it('Should correctly update the user based on the given info', async () => {
    const updateUserInput = {
      id: 'test_id',
      status: Status.OK,
      role: Role.COORDINATOR,
      onlineStatus: OnlineStatus.OFFLINE,
      statusTimeStamp: 'test_time_stamp',
      logoutTime: 'test_logout_time',
    };
    const updatedUser = await userController.updateUser(updateUserInput);

    expect(updatedUser.role).toEqual(updateUserInput.role);
    expect(updatedUser.status).toEqual(updateUserInput.status);
    expect(updatedUser.onlineStatus).toEqual(updateUserInput.onlineStatus);
    expect(updatedUser.statusTimeStamp).toEqual(
      updateUserInput.statusTimeStamp
    );
    expect(updatedUser.logoutTime).toEqual(updateUserInput.logoutTime);
  });

  it('Should not update anything if the given attribute is null', async () => {
    const updateUserInput = {
      id: 'test_id',
    };
    const userRepository = ESNDataSource.getRepository(User);
    const updatedUser = await userController.updateUser(updateUserInput);
    const user =
      (await userRepository.findOneBy({id: 'test_id'})) || new User();

    expect(updatedUser.role).toEqual(user.role);
    expect(updatedUser.status).toEqual(user.status);
    expect(updatedUser.onlineStatus).toEqual(user.onlineStatus);
    expect(updatedUser.statusTimeStamp).toEqual(user.statusTimeStamp);
    expect(updatedUser.logoutTime).toEqual(user.logoutTime);
  });

  it('Should throw an error if the user is not in database', async () => {
    const invalidUpdateUserInput = {
      id: 'invalid id',
      logoutTime: 'test_logout_time',
    };

    try {
      await userController.updateUser(invalidUpdateUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('deleteUser', () => {
  it('Should delete the user from database', async () => {
    await userController.deleteUser('test_id');

    const userRepository = ESNDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id: 'test_id'});

    expect(user).toBeNull();
  });
});

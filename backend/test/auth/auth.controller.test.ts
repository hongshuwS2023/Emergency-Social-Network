import AuthController from '../../src/auth/auth.controller';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import TokenResponse from '../../src/responses/token.response';
import {Room} from '../../src/room/room.entity';
import {Role, User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';

const authController = new AuthController();

beforeEach(async () => {
  await ESNDataSource.initialize();
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('registerUser', () => {
  it('Should successfully register for the user when all the fields are valid', async () => {
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    // Create another user for room initialization
    const secondAuthUserInput = {
      username: 'test_username_2',
      password: 'test_password',
    };
    const roomRepository = ESNDataSource.getRepository(Room);
    const userRepository = ESNDataSource.getRepository(User);
    const room = await roomRepository.create();
    room.id = 'public';
    await roomRepository.save(room);

    const tokenResponse = await authController.registerUser(authUserInput);
    await authController.registerUser(secondAuthUserInput);
    const user =
      (await userRepository.findOneBy({
        username: secondAuthUserInput.username,
      })) || new User();

    expect(tokenResponse.expires_in).toBe('3600s');
    expect(tokenResponse.user_id).not.toBeNull();
    expect(tokenResponse.token).not.toBeNull();
    expect((user.rooms = [room]));
  });

  it('Should failed register for the user when any of the field is invalid', async () => {
    // Case that username is reversed
    const reservedUserInput = {
      username: 'about',
      password: 'test_password',
    };

    try {
      await authController.registerUser(reservedUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADUSERNAMEREQ
      );
    }

    // Case username not long enough
    const shortUserInput = {
      username: 'ab',
      password: 'test_password',
    };

    try {
      await authController.registerUser(shortUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADUSERNAMEREQ
      );
    }

    // Case password is too short
    const badPassInput = {
      username: 'badpassword',
      password: '123',
    };

    try {
      await authController.registerUser(badPassInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADPASSWORDREQ
      );
    }

    // Case register duplicate user
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    await authController.registerUser(authUserInput);

    try {
      await authController.registerUser(authUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.DUPLICATEUSER
      );
    }
  });
});

describe('loginUser', () => {
  it('Should successfully login for the user when all the fields are valid', async () => {
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    await authController.registerUser(authUserInput);

    const tokenResponse = await authController.loginUser(authUserInput);

    expect(tokenResponse.expires_in).toBe('3600s');
    expect(tokenResponse.user_id).not.toBeNull();
    expect(tokenResponse.token).not.toBeNull();
  });

  it('Should failed to login for the user when any of the field is invalid', async () => {
    // Case bad password
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    const badPassInput = {
      username: 'test_username',
      password: '123',
    };
    await authController.registerUser(authUserInput);

    try {
      await authController.loginUser(badPassInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.BADPASSWORDREQ
      );
    }

    // Case bad password
    const wrongPassInput = {
      username: 'test_username',
      password: '12345',
    };

    try {
      await authController.loginUser(wrongPassInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGPASSWORD
      );
    }

    // Case user not exist
    const wrongUserInput = {
      username: 'test_username_1',
      password: 'test_password',
    };
    try {
      await authController.loginUser(wrongUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('logoutUser', () => {
  it('Should successfully logout for the user', async () => {
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    await authController.registerUser(authUserInput);
    const userRepository = ESNDataSource.getRepository(User);
    const user =
      (await userRepository.findOneBy({
        username: 'hakan',
      })) || new User();
    const lougoutUserInput = {
      id: user.id,
    };

    const tokenResponse = await authController.logoutUser(lougoutUserInput);

    expect(tokenResponse).toEqual(new TokenResponse('', '', '', '', Role.CITIZEN));
  });

  it('Should fail to logout if the logout input is invalid', async () => {
    const authUserInput = {
      username: 'test_username',
      password: 'test_password',
    };
    const lougoutUserInput = {
      id: 'invalid id',
    };
    await authController.registerUser(authUserInput);

    try {
      await authController.logoutUser(lougoutUserInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

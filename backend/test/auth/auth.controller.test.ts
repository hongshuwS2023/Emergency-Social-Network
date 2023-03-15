import AuthController from '../../src/auth/auth.controller';
import { ApiException, ErrorMessage } from '../../src/responses/api.exception';
import ESNDataSource from '../../src/utils/datasource';

const authController = new AuthController();

beforeEach(async () => {
  await ESNDataSource.initialize();
});

afterEach(async () => {
  await ESNDataSource.destroy();
})


describe('Test AuthController register method', () => {
  it('Should successfully register for the user when all the fields are valid', async () => {
    const authUserInput = {
      username: 'hakan',
      password: '12345',
    };
    const tokenResponse = await authController.registerUser(authUserInput);

    expect(tokenResponse.expires_in).toBe('3600s');
    expect(tokenResponse.user_id).not.toBeNull();
    expect(tokenResponse.token).not.toBeNull();
  });
  
  it('Should failed register for the user when any of the field is invalid', async () => {
    const reservedUserInput = {
      username: 'about',
      password: '12345',
    };
    try {
      await authController.registerUser(reservedUserInput);
    }
    catch(error) {
      expect((<ApiException>error).error_message).toBe(ErrorMessage.BADUSERNAMEREQ);
    }

    const shortUserInput = {
      username: 'ab',
      password: '12345',
    };
    try {
      await authController.registerUser(shortUserInput);
    }
    catch(error) {
      expect((<ApiException>error).error_message).toBe(ErrorMessage.BADUSERNAMEREQ);
    }

    const badPassInput = {
      username: 'badpassword',
      password: '123',
    };
    try {
      await authController.registerUser(badPassInput);
    }
    catch(error) {
      expect((<ApiException>error).error_message).toBe(ErrorMessage.BADPASSWORDREQ);
    }
  });
});

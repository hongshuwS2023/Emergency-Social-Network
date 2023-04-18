import ProfileController from '../../src/profile/profile.controller';
import AdminChangeInput from '../../src/requests/adminchange.input';
import {
  BadRequestException,
  NotFoundException,
} from '../../src/responses/api.exception';
import {AccountStatus, Role, User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';

const profileController = new ProfileController();
const userRepository = ESNDataSource.getRepository(User);

beforeEach(async () => {
  await ESNDataSource.initialize();

  const testUser = userRepository.create();

  testUser.id = 'abc';
  testUser.username = 'test-user';
  testUser.password = 'test-password';

  await userRepository.save(testUser);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('getProfileById', () => {
  it('Should get the profile if the userid is valid', async () => {
    const user = await profileController.getProfileByUserId('abc');

    expect(user.id).toBe('abc');
    expect(user.username).toBe('test-user');
    expect(user.accountStatus).toBe(AccountStatus.ACTIVE);
  });

  it('Should throw error if the userid is invalid', async () => {
    try {
      await profileController.getProfileByUserId('abcd');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      return;
    }

    expect(true).toBeFalsy();
  });
});

describe('updateUserProfile', () => {
  it('Should get the profile if the input fits all role', async () => {
    const adminChangeInput: AdminChangeInput = {
      id: 'abc',
      username: 'test-user123',
      role: Role.COORDINATOR,
      accountStatus: AccountStatus.INACTIVE,
    };

    const user = await profileController.updateUserProfile(adminChangeInput);

    expect(user.id).toBe('abc');
    expect(user.username).toBe('test-user123');
    expect(user.accountStatus).toBe(AccountStatus.INACTIVE);
    expect(user.role).toBe(Role.COORDINATOR);
  });

  it('Should throw error if any of the input is invalid', async () => {
    const adminChangeInput: AdminChangeInput = {
      id: 'abcd',
      username: 'test',
      password: '12',
      role: Role.COORDINATOR,
      accountStatus: AccountStatus.INACTIVE,
    };

    try {
      await profileController.updateUserProfile(adminChangeInput);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    adminChangeInput.id = 'abc';

    try {
      await profileController.updateUserProfile(adminChangeInput);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }

    adminChangeInput.username = 'test-user';

    try {
      await profileController.updateUserProfile(adminChangeInput);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }

    adminChangeInput.password = 'test-pass';
  });

  it('Should throw error if change role of the only admin', async () => {
    const adminChangeInput: AdminChangeInput = {
      id: 'abc',
      username: 'test-user123',
      role: Role.ADMIN,
    };

    await profileController.updateUserProfile(adminChangeInput);

    adminChangeInput.role = Role.CITIZEN;

    try {
      await profileController.updateUserProfile(adminChangeInput);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      return;
    }

    expect(true).toBeFalsy();
  });
});

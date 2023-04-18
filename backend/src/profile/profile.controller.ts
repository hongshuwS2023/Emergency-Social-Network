import {Body, Get, Put, Query, Route} from 'tsoa';
import {Repository} from 'typeorm';
import AdminChangeInput from '../requests/adminchange.input';
import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from '../responses/api.exception';
import {AccountStatus, Role, User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import {SocketServer} from '../utils/socketServer';
import {
  encodePassword,
  validatePassword,
  validateUsername,
} from '../utils/utils';

@Route('api/profiles')
export default class ProfileController {
  private socketServer: SocketServer;
  private userRepository: Repository<User>;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Get Profile by userId
   * @param userId
   * @returns User
   */
  @Get('{userId}')
  async getProfileByUserId(@Query() userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({id: userId});

    if (!user) {
      throw new NotFoundException(ErrorMessage.USERNOTFOUND);
    }

    return user;
  }

  /**
   * Update user account status/role/username/password
   * @param adminChangeInput
   * @returns User
   */
  @Put()
  async updateUserProfile(
    @Body() adminChangeInput: AdminChangeInput
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({id: adminChangeInput.id});

    if (!user) {
      throw new NotFoundException(ErrorMessage.USERNOTFOUND);
    }

    if (adminChangeInput.accountStatus) {
      user.accountStatus = adminChangeInput.accountStatus;
    }

    if (adminChangeInput.role !== null) {
      if (
        user.role === Role.ADMIN &&
        <Role>adminChangeInput.role !== Role.ADMIN
      ) {
        const numActiveAdmins = await this.userRepository.countBy({
          role: Role.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
        });

        if (numActiveAdmins === 1) {
          throw new BadRequestException(ErrorMessage.ATLEASTONEADMIN);
        }
      }

      user.role = adminChangeInput.role!;
    }

    if (adminChangeInput.username) {
      validateUsername(adminChangeInput.username);
      user.username = adminChangeInput.username;
    }

    if (adminChangeInput.password) {
      validatePassword(adminChangeInput.password);
      user.password = encodePassword(adminChangeInput.password);
    }

    const res = await this.userRepository.save(user);

    if (adminChangeInput.accountStatus === AccountStatus.INACTIVE) {
      this.socketServer.notifyInactiveUser(user.id);
    }

    this.socketServer.broadcastUsers();

    return res;
  }
}

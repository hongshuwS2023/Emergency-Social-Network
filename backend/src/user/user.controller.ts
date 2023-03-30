import {Repository} from 'typeorm';
import {NotFoundException, ErrorMessage} from '../responses/api.exception';
import UpdateUserInput from '../requests/updateuser.input';
import ESNDataSource from '../utils/datasource';
import {User} from './user.entity';
import {Body, Delete, Get, Put, Route} from 'tsoa';
import {HistoryStatus} from '../status/status.entity';
import {v4 as uuid} from 'uuid';

@Route('/api/users')
export default class UserController {
  userRepository: Repository<User>;
  statusRepository: Repository<HistoryStatus>;

  constructor() {
    this.userRepository = ESNDataSource.getRepository(User);
    this.statusRepository = ESNDataSource.getRepository(HistoryStatus);
  }

  /**
   * Get a user based on userId provided, related rooms are retrieved with the user
   * @param userId
   * @returns user entity
   */
  @Get('{userId}')
  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['rooms'],
      where: {
        id: userId,
      },
    });

    if (user === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    return user;
  }

  /**
   * Get a user based on userId provided
   * @param userId
   * @returns user entity
   */
  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });

    return users;
  }

  /**
   * Update the states of an user based on state provieded
   * @param updateUserInput
   * @returns user entity
   */
  @Put()
  async updateUser(@Body() updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOneBy({id: updateUserInput.id});

    if (!user) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    user.role = updateUserInput.role ? updateUserInput.role : user.role;
    user.status = updateUserInput.status ? updateUserInput.status : user.status;
    if (updateUserInput.status) {
      const newStatus = this.statusRepository.create();
      newStatus.user = user;
      newStatus.id = uuid();
      newStatus.status = updateUserInput.status;
      newStatus.timeStamp = String(new Date().getTime());
      await this.statusRepository.save(newStatus);
    }
    user.onlineStatus = updateUserInput.onlineStatus
      ? updateUserInput.onlineStatus
      : user.onlineStatus;
    user.statusTimeStamp = updateUserInput.statusTimeStamp
      ? updateUserInput.statusTimeStamp
      : user.statusTimeStamp;
    user.logoutTime = updateUserInput.logoutTime
      ? updateUserInput.logoutTime
      : user.logoutTime;

    return await this.userRepository.save(user);
  }

  /**
   * Delete an user from the system
   * @param userId
   * @returns true
   */
  @Delete('{userId}')
  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);

    await this.userRepository.delete({id: user.id});
    return true;
  }
}

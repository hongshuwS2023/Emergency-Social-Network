import {Repository} from 'typeorm';
import {NotFoundException, ErrorMessage} from '../exceptions/api.exception';
import {UpdateUserInput} from '../requests/updateuser.input';
import ESNDataSource from '../utils/datasource';
import {User} from './user.entity';
import {Body, Delete, Get, Put, Route} from 'tsoa';
@Route('/api/users')
export default class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Get a user based on userId provided
   * @param userId
   * @returns user entity
   */
  @Get('{userId}')
  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      relations:{
        rooms: true,
      },
      where:{
        id: userId
      }
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
    const user = await this.getUser(updateUserInput.id);

    user.username = updateUserInput.username
      ? updateUserInput.username
      : user.username;
    user.password = updateUserInput.password
      ? updateUserInput.password
      : user.password;
    user.role = updateUserInput.role ? updateUserInput.role : user.role;
    user.status = updateUserInput.status ? updateUserInput.status : user.status;

    return await this.userRepository.save(user);
  }

  /**
   * Delete an user from the system
   * @param userId
   * @returns true
   */
  @Delete('{userId}')
  async deleteUser(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);

    await this.userRepository.delete({id: user.id});
    return true;
  }
}

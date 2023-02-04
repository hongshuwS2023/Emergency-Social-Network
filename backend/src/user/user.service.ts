import {Repository} from 'typeorm';
import {UpdateUserInput} from '../requests/updateuser.input';
import ESNDataSource from '../utils/datasource';
import {User} from './user.entity';

export default class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = ESNDataSource.getRepository(User);
  }

  async getUser(userid: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneByOrFail({id: userid});
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    try {
      console.log(updateUserInput);
      const user = await this.getUser(updateUserInput.id);

      user.username = updateUserInput.username
        ? updateUserInput.username
        : user.username;
      user.password = updateUserInput.password
        ? updateUserInput.password
        : user.password;
      user.role = updateUserInput.role ? updateUserInput.role : user.role;
      user.status = updateUserInput.status
        ? updateUserInput.status
        : user.status;

      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    await this.userRepository.delete({id: userId});
    return true;
  }
}

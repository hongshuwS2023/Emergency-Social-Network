import {Repository} from 'typeorm';
import {NotFoundException} from '../exceptions/api.exception';
import {UpdateUserInput} from '../requests/updateuser.input';
import ESNDataSource from '../utils/datasource';
import {User} from './user.entity';

export default class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = ESNDataSource.getRepository(User);
  }

  async getUser(userid: number): Promise<User> {
    const user = await this.userRepository.findOneBy({id: userid});

    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
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

  async deleteUser(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);

    await this.userRepository.delete({id: user.id});
    return true;
  }
}

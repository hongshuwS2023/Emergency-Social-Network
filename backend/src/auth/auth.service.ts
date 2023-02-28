import {Repository} from 'typeorm';
import {AuthUserInput} from '../requests/authuser.input';
import {OnlineStatus, Role, Status, User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  BadRequestException,
  DuplicateResourceException,
  ErrorMessage,
} from '../exceptions/api.exception';
import {RESERVED_USERNAME} from './reserved-username';
import AuthResponse from '../responses/auth.response';
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import {LogoutInput} from '../requests/logout.input';
import {SocketIo} from '../utils/socketIo';
@Route('api/auth')
export default class AuthService {
  authRepository: Repository<User>;
  roomRepository: Repository<Room>;
  jwtSecret: string;
  expiresIn: string;
  salt: string;
  constructor() {
    this.authRepository = ESNDataSource.getRepository(User);
    this.roomRepository = ESNDataSource.getRepository(Room);
    this.jwtSecret = process.env.JWT_SECRET as string;
    this.expiresIn = process.env.EXPIRES_IN as string;
    this.salt = process.env.SALT as string;
  }
  /**
   * Registers user based on provided username and password
   * @param authUserInput
   * @returns AuthResponse
   */
  @Post('/register')
  async registerUser(
    @Body() authUserInput: AuthUserInput
  ): Promise<AuthResponse> {
    const {username, password} = authUserInput;
    if (
      username.length < 3 ||
      RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
    ) {
      throw new BadRequestException(ErrorMessage.BADUSERNAMEREQ);
    }
    if (password.length < 4) {
      throw new BadRequestException(ErrorMessage.BADPASSWORDREQ);
    }
    const existingUser = await this.authRepository.findOneBy({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      throw new DuplicateResourceException(ErrorMessage.DUPLICATEUSER);
    }
    const user = new User();
    user.username = authUserInput.username.toLowerCase();
    user.password = this.encodePassword(authUserInput.password);
    user.role = Role.CITIZEN;
    user.status = Status.Undefined;
    user.onlineStatus = OnlineStatus.ONLINE;
    const room = await this.roomRepository.findOneBy({name: 'public'});
    if (room === null) {
      const newRoom = new Room();
      newRoom.name = 'public';
      user.rooms = [newRoom];
      await this.roomRepository.save(newRoom);
    } else {
      user.rooms = [room];
    }
    const newUser = await this.authRepository.save(user);
    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
        status: newUser.status,
      },
      this.jwtSecret,
      {
        expiresIn: this.expiresIn,
      }
    );
    return new AuthResponse(
      newUser.id,
      newUser.username,
      newUser.status,
      token
    );
  }
  /**
   * login user based on provided username and password
   * @param authUserInput
   * @returns AuthResponse
   */
  @Post('/login')
  async loginUser(@Body() authUserInput: AuthUserInput): Promise<AuthResponse> {
    const {username, password} = authUserInput;
    if (
      username.length < 3 ||
      RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
    ) {
      throw new BadRequestException(ErrorMessage.BADUSERNAMEREQ);
    }
    if (password.length < 4) {
      throw new BadRequestException(ErrorMessage.BADPASSWORDREQ);
    }
    const user = await this.authRepository.findOneBy({
      username: authUserInput.username.toLowerCase(),
    });
    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    if (this.encodePassword(authUserInput.password) !== user.password) {
      throw new BadRequestException(ErrorMessage.WRONGPASSWORD);
    }
    user.onlineStatus = OnlineStatus.ONLINE;
    await this.authRepository.save(user);
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        status: user.status,
      },
      this.jwtSecret,
      {
        expiresIn: this.expiresIn,
      }
    );
    const users = await this.authRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });
    SocketIo.getInstance().getIO().emit('online status', users);
    return new AuthResponse(user.id, user.username, user.status, token);
  }
  @Post('/logout')
  async logoutUser(@Body() logoutInput: LogoutInput): Promise<User> {
    const user = await this.authRepository.findOneBy({id: logoutInput.id});
    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    user.onlineStatus = OnlineStatus.OFFLINE;
    const newUser = await this.authRepository.save(user);
    const users = await this.authRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });
    SocketIo.getInstance().getIO().emit('online status', users);
    return newUser;
  }

  encodePassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.salt, 1000, 32, 'sha512')
      .toString('hex');
  }
}

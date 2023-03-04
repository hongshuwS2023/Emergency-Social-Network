import {Repository} from 'typeorm';
import AuthUserInput from './dto/authuser.input';
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
import TokenResponse from './dto/token.response';
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import LogoutInput from './dto/logout.input';
import {SocketServer} from '../utils/socketServer';

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
   * @returns TokenResponse
   */
  @Post('/register')
  async registerUser(
    @Body() authUserInput: AuthUserInput
  ): Promise<TokenResponse> {
    const {username, password} = authUserInput;

    this.validateUsernameAndPassword(username, password);

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
    return new TokenResponse(newUser.id, token, this.expiresIn);
  }
  /**
   * login user based on provided username and password
   * @param authUserInput
   * @returns TokenResponse
   */
  @Post('/login')
  async loginUser(
    @Body() authUserInput: AuthUserInput
  ): Promise<TokenResponse> {
    const {username, password} = authUserInput;

    this.validateUsernameAndPassword(username, password);

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
<<<<<<< HEAD
    SocketServer.emitEvent('online status', users);
    return new AuthResponse(user.id, user.username, user.status, token);
  }

  /**
   * logout user based on provided user id
   * @param logoutInput
   * @returns user entity
=======
    SocketServer.io.emit('online status', users);
    return new TokenResponse(user.id, token, this.expiresIn);
  }

  /**
   * Logout the user
   * @param logoutInput
   * @returns TokenResponse
>>>>>>> 51a6f4c49ec219fdefb0a2d7e14bf82b2d053e53
   */
  @Post('/logout')
  async logoutUser(@Body() logoutInput: LogoutInput): Promise<TokenResponse> {
    const user = await this.authRepository.findOneBy({id: logoutInput.id});
    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    user.onlineStatus = OnlineStatus.OFFLINE;
    await this.authRepository.save(user);
    const users = await this.authRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });
<<<<<<< HEAD
    SocketServer.emitEvent('online status', users);
    return newUser;
=======
    SocketServer.io.emit('online status', users);
    return new TokenResponse(-1, '', '');
>>>>>>> 51a6f4c49ec219fdefb0a2d7e14bf82b2d053e53
  }

  private validateUsernameAndPassword(username: string, password: string) {
    if (
      username.length < 3 ||
      RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
    ) {
      throw new BadRequestException(ErrorMessage.BADUSERNAMEREQ);
    }
    if (password.length < 4) {
      throw new BadRequestException(ErrorMessage.BADPASSWORDREQ);
    }
  }

  private encodePassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.salt, 1000, 32, 'sha512')
      .toString('hex');
  }
}

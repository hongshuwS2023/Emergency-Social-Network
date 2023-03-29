import {Repository} from 'typeorm';
import AuthUserInput from '../requests/authuser.input';
import {OnlineStatus, Role, Status, User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  BadRequestException,
  DuplicateResourceException,
  ErrorMessage,
} from '../responses/api.exception';
import {RESERVED_USERNAME} from './reserved-username';
import TokenResponse from '../responses/token.response';
import {Body, Post, Route} from 'tsoa';
import {Room} from '../room/room.entity';
import LogoutInput from '../requests/logout.input';
import {SocketServer} from '../utils/socketServer';
import {v4 as uuid} from 'uuid';
import {HistoryStatus} from '../status/status.entity';

@Route('api/auth')
export default class AuthController {
  private socketServer: SocketServer;
  private authRepository: Repository<User>;
  private roomRepository: Repository<Room>;
  private statusRepository: Repository<HistoryStatus>;
  private jwtSecret: string;
  private expiresIn: string;
  private salt: string;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.authRepository = ESNDataSource.getRepository(User);
    this.roomRepository = ESNDataSource.getRepository(Room);
    this.statusRepository = ESNDataSource.getRepository(HistoryStatus);
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
      username: username,
    });

    if (existingUser) {
      throw new DuplicateResourceException(ErrorMessage.DUPLICATEUSER);
    }

    const user = this.authRepository.create();
    user.id = uuid();
    user.username = username;
    user.password = this.encodePassword(password);
    user.role = Role.CITIZEN;
    user.status = Status.UNDEFINED;
    user.onlineStatus = OnlineStatus.ONLINE;
    user.statusTimeStamp = new Date().getTime().toString();
    user.logoutTime = '';

    const room = await this.roomRepository.findOneBy({id: 'public'});

    if (room === null) {
      const newRoom = this.roomRepository.create();
      newRoom.id = 'public';
      user.rooms = [newRoom];
      await this.roomRepository.save(newRoom);
    } else {
      user.rooms = [room];
    }
    await this.authRepository.save(user);
    const status = this.statusRepository.create();
    status.user = user;
    status.id = uuid();
    status.status = user.status;
    status.timeStamp = String(new Date().getTime());
    await this.statusRepository.save(status);

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

    await this.socketServer.broadcastUsers();

    return new TokenResponse(user.id, user.username, token, this.expiresIn);
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
      username: username,
      password: this.encodePassword(password),
    });

    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
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

    await this.socketServer.broadcastUsers();

    return new TokenResponse(user.id, user.username, token, this.expiresIn);
  }

  /**
   * Logout the user
   * @param logoutInput
   * @returns TokenResponse
   */
  @Post('/logout')
  async logoutUser(@Body() logoutInput: LogoutInput): Promise<TokenResponse> {
    const user = await this.authRepository.findOneBy({id: logoutInput.id});
    if (user === null) {
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    user.onlineStatus = OnlineStatus.OFFLINE;
    user.logoutTime = new Date().getTime().toString();
    await this.authRepository.save(user);

    await this.socketServer.broadcastUsers();

    return new TokenResponse('', '', '', '');
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

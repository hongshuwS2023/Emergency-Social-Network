import { Repository } from 'typeorm';
import { AuthUserInput } from '../requests/authuser.input';
import { Role, Status, User } from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { BadRequestException, DuplicateResourceException, ErrorMessage } from '../exceptions/api.exception';
import { RESERVED_USERNAME } from './reserved-username';
import AuthResponse from '../responses/auth.response';
import { Body, Post, Route } from 'tsoa';
import { Room } from '../room/room.entity';

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
  async registerUser(@Body()authUserInput: AuthUserInput): Promise<AuthResponse> {
    const { username, password } = authUserInput;
    if (
      username.length < 3 ||
      RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
    ) {
      throw new BadRequestException(ErrorMessage.BADUSERNAMEREQ);
    }

    if (password.length < 4) {
      throw new BadRequestException(ErrorMessage.BADPASSWORDREQ);
    }

    const existingUser = await this.authRepository.findOneBy({ username: username.toLowerCase() });
    if (existingUser) {
      throw new DuplicateResourceException(ErrorMessage.DUPLICATEUSER);
    }
    

    const user = new User();
    user.username = authUserInput.username.toLowerCase();
    user.password = this.encodePassword(authUserInput.password);
    user.role = Role.CITIZEN;
    user.status = Status.Undefined;

    const room = await this.roomRepository.findOneBy({name:'public'});
    if(room === null){
      const newRoom = new Room();
      newRoom.name = 'public';
      user.rooms = [newRoom];
    }else{
      user.rooms.push(room);
    }
    const newUesr = await this.authRepository.save(user);
    // const newRoom = await this.roomRepository.save(room);


    const token = jwt.sign(
      {
        id: newUesr.id,
        role: newUesr.role,
        status: newUesr.status,
      },
      this.jwtSecret,
      {
        expiresIn: this.expiresIn,
      }
    );
    return new AuthResponse(newUesr.id, token);
  }

    /**
   * login user based on provided username and password
   * @param authUserInput 
   * @returns AuthResponse
   */
  @Post('/login')
  async loginUser(@Body()authUserInput: AuthUserInput): Promise<AuthResponse> {
    const { username, password } = authUserInput;
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
    
    user.onlineStatus = true;
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
    return new AuthResponse(user.id, token);
  }


  @Post('/logout')
  async logoutUser(@Body()userId: number): Promise<User> {
    const user = await this.authRepository.findOneBy({id:userId});
    if(user === null){
      throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
    }
    user.onlineStatus = false;
    return await this.authRepository.save(user);
  }


  encodePassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.salt, 1000, 32, 'sha512')
      .toString('hex');
  }
}

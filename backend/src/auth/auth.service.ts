import {Repository} from 'typeorm';
import {AuthUserInput} from '../requests/authuser.input';
import {Role, Status, User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {BadRequestException} from '../exceptions/api.exception';
import {RESERVED_USERNAME} from './reserved-username';
import AuthResponse from '../responses/auth.response';

export default class AuthService {
  authRepository: Repository<User>;
  jwtSecret: string;
  expiresIn: string;
  salt: string;
  constructor() {
    this.authRepository = ESNDataSource.getRepository(User);
    this.jwtSecret = process.env.JWT_SECRET as string;
    this.expiresIn = process.env.EXPIRES_IN as string;
    this.salt = process.env.SALT as string;
  }

  async registerUser(authUserInput: AuthUserInput): Promise<AuthResponse> {
    const {username, password} = authUserInput;

    if (
      username.length < 3 ||
      RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
    ) {
      throw new BadRequestException('Please provide a different username');
    }

    if (password.length < 4) {
      throw new BadRequestException('Please provide a different password');
    }
    const user = new User();
    user.username = authUserInput.username;
    user.password = this.encodePassword(authUserInput.password);
    user.role = Role.CITIZEN;
    user.status = Status.Undefined;

    const newUesr = await this.authRepository.save(user);
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

  async loginUser(authUserInput: AuthUserInput): Promise<AuthResponse> {
    const user = await this.authRepository.findOneBy({
      username: authUserInput.username,
    });

    if (user === null) {
      throw new BadRequestException('Please check your username');
    }

    if (this.encodePassword(authUserInput.password) !== user.password) {
      throw new BadRequestException('Please check your password');
    }

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

  encodePassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, this.salt, 1000, 32, 'sha512')
      .toString('hex');
  }
}

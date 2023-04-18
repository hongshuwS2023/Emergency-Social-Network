import {RESERVED_USERNAME} from '../auth/reserved-username';
import {BadRequestException, ErrorMessage} from '../responses/api.exception';
import crypto from 'crypto';
import AuthController from '../auth/auth.controller';
export const validateUsername = (username: string) => {
  if (
    username.length < 3 ||
    RESERVED_USERNAME.indexOf(username.toLowerCase()) !== -1
  ) {
    throw new BadRequestException(ErrorMessage.BADUSERNAMEREQ);
  }
};

export const validatePassword = (password: string) => {
  if (password.length < 4) {
    throw new BadRequestException(ErrorMessage.BADPASSWORDREQ);
  }
};

export const encodePassword = (password: string): string => {
  return crypto
    .pbkdf2Sync(password, process.env.SALT || 'salt', 1000, 32, 'sha512')
    .toString('hex');
};

export const ensureAdmin = () => {
  new AuthController().ensureAdmin();
};

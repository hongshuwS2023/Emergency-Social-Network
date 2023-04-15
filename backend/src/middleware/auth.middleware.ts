import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import JwtInput from '../requests/jwt.input';
import {
  ErrorMessage,
  BadRequestException,
  UnauthorizedException,
} from '../responses/api.exception';
import {Role} from '../user/user.entity';

export const restVerifyToken = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (
    req.originalUrl.match('/api/auth/*') ||
    req.originalUrl.match('/api/docs')
  ) {
    next();
    return;
  }

  const header = req.headers['authorization'] as string;

  if (!header) {
    const error = new BadRequestException(ErrorMessage.AUTHNOHEADER);
    next(error);
    return;
  }

  const token = header.split(' ')[1];

  if (!header) {
    const error = new BadRequestException(ErrorMessage.AUTHWRONGHEADER);
    next(error);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async (err, data) => {
    if (err || !data) {
      const error = new UnauthorizedException(ErrorMessage.AUTHUNAUTHORIZED);
      next(error);
      return;
    }

    const role = (<JwtInput>data).role;

    if (role !== Role.ADMIN && req.originalUrl.match('/api/profile*')) {
      const error = new UnauthorizedException(ErrorMessage.AUTHUNAUTHORIZED);
      next(error);
      return;
    }

    next();
  });
};

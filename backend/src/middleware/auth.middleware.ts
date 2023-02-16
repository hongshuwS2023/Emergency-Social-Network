import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {
  ErrorMessage,
  BadRequestException,
  UnauthorizedException,
} from '../exceptions/api.exception';

export const restVerifyToken = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.originalUrl.match('/api/auth/*') || req.originalUrl.match('/api/docs')) {
    next();
    return;
  }

  const header = req.headers['authorization'] as string;

  if (!header) {
    throw new BadRequestException(ErrorMessage.AUTHNOHEADER);
  }

  const token = header.split(' ')[1];

  if (!header) {
    throw new BadRequestException(ErrorMessage.AUTHWRONGHEADER);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async (err, data) => {
    if (err || !data) {
      throw new UnauthorizedException(ErrorMessage.AUTHUNAUTHORIZED);
    }

    next();
  });
};

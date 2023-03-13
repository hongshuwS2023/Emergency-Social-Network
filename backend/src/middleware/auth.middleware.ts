import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {
  ErrorMessage,
  BadRequestException,
  UnauthorizedException,
} from '../responses/api.exception';

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
  }

  const token = header.split(' ')[1];

  if (!header) {
    const error = new BadRequestException(ErrorMessage.AUTHWRONGHEADER);
    next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async (err, data) => {
    if (err || !data) {
      const error = new UnauthorizedException(ErrorMessage.AUTHUNAUTHORIZED);
      next(error);
    }

    next();
  });
};

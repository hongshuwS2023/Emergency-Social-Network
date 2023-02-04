import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {UnauthorizedException} from '../exceptions/api.exception';

export const restVerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.originalUrl.match('/api/auth/*')) {
    next();
    return;
  }

  const header = req.headers['authorization'] as string;

  if (!header) {
    throw new UnauthorizedException('Unauthorized');
  }

  const token = header.split(' ')[1];

  if (!header) {
    throw new UnauthorizedException('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async (err, data) => {
    if (err || !data) {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  });
};

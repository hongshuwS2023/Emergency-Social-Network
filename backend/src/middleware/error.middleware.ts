import {NextFunction, Request, Response} from 'express';
import {ApiException} from '../exceptions/api.exception';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(200);
  res.send((err as ApiException).toJson());
};

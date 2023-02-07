import {NextFunction, Request, Response} from 'express';
import {ApiException} from '../exceptions/api.exception';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200);
  res.send((err as ApiException).toJson());
};

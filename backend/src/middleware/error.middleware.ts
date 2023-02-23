import {NextFunction, Request, Response} from 'express';
import {ApiException} from '../exceptions/api.exception';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  res.status(200);
  if (err instanceof ApiException) {
    res.send((err as ApiException).toJson());
  } else {
    console.log(err.message);
  }
};

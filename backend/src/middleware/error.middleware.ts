import {Request, Response, NextFunction} from 'express';
import {ApiException} from '../responses/api.exception';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200);

  if (err instanceof ApiException) {
    res.send((err as ApiException).toJson());
  } else {
    res.send(err.message);
  }
  next();
};

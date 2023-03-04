import {NextFunction, Request, Response} from 'express';
import {ErrorMessage, UnauthorizedException} from '../responses/api.exception';

interface ISpeedtestRequest extends Request {
  userId: number;
}
export class SpeedTestMiddleware {
  private userId: number;
  private numPostRequests: number;
  private numGetRequests: number;
  private static instance: SpeedTestMiddleware;
  private constructor() {
    this.userId = -1;
    this.numGetRequests = 0;
    this.numPostRequests = 0;
  }

  static getInstance() {
    if (!SpeedTestMiddleware.instance) {
      SpeedTestMiddleware.instance = new SpeedTestMiddleware();
    }

    return SpeedTestMiddleware.instance;
  }
  async handleSpeedTest(req: Request, _: Response, next: NextFunction) {
    if (SpeedTestMiddleware.instance.userId === -1) {
      next();
      return;
    }

    if (
      (req as ISpeedtestRequest).userId !== SpeedTestMiddleware.instance.userId
    ) {
      next(new UnauthorizedException(ErrorMessage.ONGOINGSPEEDTEST));
      return;
    }

    if (req.originalUrl.match('api/messages')) {
      if (req.method === 'GET') {
        SpeedTestMiddleware.instance.numGetRequests += 1;
      } else if (req.method === 'POST') {
        SpeedTestMiddleware.instance.numPostRequests += 1;
      }
    }

    next();
  }

  setUserId(userId: number) {
    this.userId = userId;
  }

  reset() {
    SpeedTestMiddleware.instance.userId = -1;
    SpeedTestMiddleware.instance.numGetRequests = 0;
    SpeedTestMiddleware.instance.numPostRequests = 0;
  }

  getStats() {
    return [
      SpeedTestMiddleware.instance.numGetRequests,
      SpeedTestMiddleware.instance.numPostRequests,
    ];
  }
}

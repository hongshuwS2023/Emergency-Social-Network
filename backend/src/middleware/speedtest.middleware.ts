import {NextFunction, Request, Response} from 'express';
import {ErrorMessage, UnauthorizedException} from '../responses/api.exception';

export class SpeedTestMiddleware {
  private userId: string;
  private numPostRequests: number;
  private numGetRequests: number;
  private static instance: SpeedTestMiddleware;
  private constructor() {
    this.userId = '';
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
    if (SpeedTestMiddleware.instance.userId === '') {
      next();
      return;
    }

    if (req.headers.userid !== SpeedTestMiddleware.instance.userId) {
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

  setUserId(userId: string) {
    this.userId = userId;
  }

  reset() {
    SpeedTestMiddleware.instance.userId = '';
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

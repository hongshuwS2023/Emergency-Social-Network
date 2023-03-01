import {NextFunction, Request, Response} from 'express';
import {Repository} from 'typeorm';
import {ErrorMessage, UnauthorizedException} from '../exceptions/api.exception';
import {SpeedTest} from '../speedtest/speedtest.entity';
import ESNDataSource from '../utils/datasource';

export class SpeedTestMiddleware {
  private speedTestRepository: Repository<SpeedTest>;

  constructor() {
    this.speedTestRepository = ESNDataSource.getRepository(SpeedTest);
  }

  async handleSpeedTest(req: Request, _: Response, next: NextFunction) {
    const onGoingSpeedTest = await this.speedTestRepository.findOneBy({
      onGoing: true,
    });

    if (onGoingSpeedTest && !req.originalUrl.match('/api/speedtest/*')) {
      next(new UnauthorizedException(ErrorMessage.ONGOINGSPEEDTEST));
      return;
    }
    next();
  }
}

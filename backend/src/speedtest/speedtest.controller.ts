import {NextFunction, Request, Response} from 'express';
import {CreateSpeedTestInput} from './dto/createspeedtest.input';
import SpeedtestService from './speedtest.service';

export default class SpeedTestController {
  private speedTestService: SpeedtestService;

  constructor() {
    this.speedTestService = new SpeedtestService();
  }

  async createSpeedTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createSpeedTestInput: CreateSpeedTestInput = req.body;

      const speedTest = await this.speedTestService.createSpeedTest(
        createSpeedTestInput
      );

      res.send(speedTest);
    } catch (error) {
      next(error);
    }
  }

  async stopSpeedTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const speedTestId = Number(req.params.testid);

      const speedTest = await this.speedTestService.stopSpeedTest(speedTestId);

      res.send(speedTest);
    } catch (error) {
      next(error);
    }
  }
}

import {Router} from 'express';
import {CreateSpeedTestInput} from '../requests/createspeedtest.input';
import SpeedTestController from './speedtest.controller';

export default class SpeedTestRoute {
  private router: Router;
  private speedTestController: SpeedTestController;

  constructor() {
    this.router = Router();
    this.speedTestController = new SpeedTestController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.post('/', async (req, res, next) => {
      try {
        const createSpeedTestInput: CreateSpeedTestInput = req.body;

        res.send(
          await this.speedTestController.createSpeedTest(createSpeedTestInput)
        );
      } catch (error) {
        next(error);
      }
    });

    this.router.put('/:testId', async (req, res, next) => {
      try {
        const speedTestId = Number(req.params.testId);

        res.send(await this.speedTestController.stopSpeedTest(speedTestId));
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

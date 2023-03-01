import {Router} from 'express';
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
    this.router.post('/', (req, res, next) => {
      this.speedTestController.createSpeedTest(req, res, next);
    });

    this.router.put('/:roomId', (req, res, next) => {
      this.speedTestController.stopSpeedTest(req, res, next);
    });
  }

  getRouter() {
    return this.router;
  }
}

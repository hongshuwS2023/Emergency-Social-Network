import {Router} from 'express';
import {CreateActivityInput} from '../requests/createactivity.input';
import {UpdateActivityInput} from '../requests/updateActivity.input';
import {SocketServer} from '../utils/socketServer';
import ActivityController from './activtiy.controller';

export default class ActivityRoute {
  router: Router;
  activityController: ActivityController;

  constructor() {
    this.router = Router();
    this.activityController = new ActivityController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.post('/', async (req, res, next) => {
      try {
        const createActivityInput: CreateActivityInput = req.body;
        const activity = await this.activityController.createActivity(
          createActivityInput
        );
        res.send(activity);
      } catch (err) {
        next(err);
      }
    });
    this.router.get('/:activityId', async (req, res, next) => {
      try {
        const activityId = req.params.activityId;
        const activity = await this.activityController.getActivity(activityId);
        res.send(activity);
      } catch (error) {
        next(error);
      }
    });
    this.router.get('/', async (_, res, next) => {
      try {
        res.send(await this.activityController.getActivities());
      } catch (error) {
        next(error);
      }
    });
    this.router.put('/', async (req, res, next) => {
      try {
        const updateActivityInput: UpdateActivityInput = req.body;
        res.send(
          await this.activityController.updateActivity(updateActivityInput)
        );
        SocketServer.getInstance().broadcastActivity();
      } catch (error) {
        next(error);
      }
    });
  }
  getRouter() {
    return this.router;
  }
}

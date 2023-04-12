import {Router} from 'express';
import EmergencyWordsController from './emergency.controller';

export default class EmergencyRoute {
  router: Router;
  emergencyController: EmergencyWordsController;

  constructor() {
    this.router = Router();
    this.emergencyController = new EmergencyWordsController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/', async (req, res, next) => {
      try {
        const messages = await this.emergencyController.getEmergencyWords(
          req.query.userid! as string,
          req.query.username! as string
        );
        res.send(messages);
      } catch (err) {
        next(err);
      }
    });

    this.router.delete('/:id', async (req, res, next) => {
      try {
        const id = req.params.id;
        await this.emergencyController.deleteEmergencyWords(id);
        res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    });

    this.router.post('/', async (req, res, next) => {
      try {
        const postEmergencyWordsInput = req.body;
        const message = await this.emergencyController.postEmergencyWords(
          postEmergencyWordsInput
        );
        res.send(message);
      } catch (err) {
        next(err);
      }
    });

    this.router.put('/', async (req, res, next) => {
      try {
        const updateEmergencyWordsInput = req.body;
        const message = await this.emergencyController.updateEmergencyWords(
          updateEmergencyWordsInput
        );
        res.send(message);
      } catch (err) {
        next(err);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

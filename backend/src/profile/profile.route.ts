import {Router} from 'express';
import AdminChangeInput from '../requests/adminchange.input';
import ProfileController from './profile.controller';

export default class ProfileRoute {
  router: Router;
  profileController: ProfileController;

  constructor() {
    this.router = Router();
    this.profileController = new ProfileController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/:userId', async (req, res, next) => {
      try {
        const userId = req.params.userId;
        res.send(await this.profileController.getProfileByUserId(userId));
      } catch (error) {
        next(error);
      }
    });

    this.router.put('/', async (req, res, next) => {
      try {
        const adminChangeInput: AdminChangeInput = req.body;
        res.send(
          await this.profileController.updateUserProfile(adminChangeInput)
        );
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

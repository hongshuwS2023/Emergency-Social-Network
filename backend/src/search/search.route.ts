import {Router} from 'express';
import SearchController from './search.controller';
import SearchInput from '../requests/search.input';

export default class SearchRoute {
  router: Router;
  searchController: SearchController;

  constructor() {
    this.router = Router();
    this.searchController = new SearchController();

    this.setRoute();
  }

  private setRoute(): void {
    this.router.get('/', async (req, res, next) => {
      try {
        const criteria = req.query.criteria!.toString();
        const context = req.query.context;
        const user_id = req.query.user_id!.toString();
        let room_id = '';
        if (req.query.room_id) {
          room_id = req.query.room_id.toString();
        }
        const searchInput: SearchInput = {
          criteria: criteria,
          context: Number(context),
          user_id: user_id,
          room_id: room_id.toString(),
        };
        const response = await this.searchController.search(searchInput);
        res.send(response);
      } catch (err) {
        next(err);
      }
    });
  }
  getRouter() {
    return this.router;
  }
}

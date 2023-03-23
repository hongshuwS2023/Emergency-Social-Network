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
    this.router.post('/', async (req, res, next) => {
      try {
        const searchInput: SearchInput = req.body;
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

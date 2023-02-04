import express from 'express';
import {createServer} from 'http';
import 'reflect-metadata';
import {User} from './user/user.entity';
import ESNDataSource from './utils/data-source';

export default class App {
  private app: express.Application;
  private port: number;
  private httpServer: any;

  private constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.port = 3000;
  }

  private registerRoutes() {
    this.app.get('/', async (_: any, res: any) => {
      const number = await ESNDataSource.getRepository(User).count();
      res.send(`total user: ${number}`);
    });
  }
  private async startServer() {
    ESNDataSource.initialize()
      .then(() => {
        console.log('database started');
        this.httpServer.listen(this.port, () => {
          console.log(`server started at http://localhost:${this.port}`);
        });
      })
      .catch(err => {
        console.log(err);
        console.log('cannot connect to database');
      });
  }
  static start() {
    const appServer = new App();
    appServer.registerRoutes();
    appServer.startServer();
  }
}

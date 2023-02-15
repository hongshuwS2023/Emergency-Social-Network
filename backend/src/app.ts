import express from 'express';
import {createServer} from 'http';
import 'reflect-metadata';
import cors from 'cors';
import AuthRoute from './auth/auth.route';
import {restVerifyToken} from './middleware/auth.middleware';
import {User} from './user/user.entity';
import UserRoute from './user/user.route';
import ESNDataSource from './utils/datasource';
import {errorHandler} from './middleware/error.middleware';
import MessageRoute from './message/message.route';

export default class App {
  private app: express.Application;
  private port: number;
  private httpServer: any;

  private constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.port = 3000;
  }

  private registerConfigs() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(restVerifyToken);
  }

  private registerRoutes() {
    this.app.get('/', async (_: any, res: any) => {
      const number = await ESNDataSource.getRepository(User).count();
      res.send(`total user: ${number}`);
    });

    this.app.use('/api/users', new UserRoute().getRouter());
    this.app.use('/api/auth', new AuthRoute().getRouter());
    this.app.use('/api/messages',new MessageRoute().getRouter());
  }

  private registerMiddlewares() {
    this.app.use(errorHandler);
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
    appServer.registerConfigs();
    appServer.registerRoutes();
    appServer.registerMiddlewares();
    appServer.startServer();
  }
}

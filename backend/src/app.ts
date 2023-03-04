import express from 'express';
import {createServer} from 'http';
import 'reflect-metadata';
import cors from 'cors';
import AuthRoute from './auth/auth.route';
import {restVerifyToken} from './middleware/auth.middleware';
import UserRoute from './user/user.route';
import ESNDataSource from './utils/datasource';
import {errorHandler} from './middleware/error.middleware';
import * as swaggerDocument from '../public/swagger.json';
import MessageRoute from './message/message.route';
import swaggerUi from 'swagger-ui-express';
import RoomRoute from './room/room.route';
import {SocketServer} from './utils/socketServer';
import {SpeedTestMiddleware} from './middleware/speedtest.middleware';
import SpeedTestRoute from './speedtest/speedtest.route';

export default class App {
  private app: express.Application;
  private port: number;
  private httpServer;
  private socketServer: SocketServer;

  private constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.port = 3000;
    this.socketServer = SocketServer.getInstance();
    this.socketServer.attach(this.httpServer);
  }

  private registerConfigs() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(restVerifyToken);
    this.app.use(SpeedTestMiddleware.getInstance().handleSpeedTest);
  }

  private registerRoutes() {
    this.app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use('/api/users', new UserRoute().getRouter());
    this.app.use('/api/auth', new AuthRoute().getRouter());
    this.app.use('/api/messages', new MessageRoute().getRouter());
    this.app.use('/api/rooms', new RoomRoute().getRouter());
    this.app.use('/api/speedtests', new SpeedTestRoute().getRouter());
  }

  private registerMiddlewares() {
    this.app.use(errorHandler);
  }

  private async startServer() {
    try {
      await ESNDataSource.initialize();

      this.httpServer.listen(this.port, () => {
        console.log(`server started at http://localhost:${this.port}`);
      });
    } catch (err) {
      console.log(err);
    }
  }

  static start() {
    const appServer = new App();
    appServer.registerConfigs();
    appServer.registerRoutes();
    appServer.registerMiddlewares();
    appServer.startServer();
  }
}

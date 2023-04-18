import express from 'express';
import {createServer, IncomingMessage, Server, ServerResponse} from 'http';
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
import SearchRoute from './search/search.route';
import ActivityRoute from './activity/activity.route';
import {RedisServer} from './utils/redisServer';
import EmergencyRoute from './emergency/emergency.route';
import ProfileRoute from './profile/profile.route';
import {ensureAdmin} from './utils/utils';

export default class App {
  private app: express.Application;
  private port: number;
  private httpServer: Server<typeof IncomingMessage, typeof ServerResponse>;
  private socketServer: SocketServer;
  private redisServer: RedisServer;

  private constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.port = 3000;
    this.socketServer = SocketServer.getInstance();
    this.socketServer.attach(this.httpServer);
    this.redisServer = RedisServer.getInstance();
  }

  private registerConfigs(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(restVerifyToken);
  }

  private registerRoutes(): void {
    this.app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use('/api/users', new UserRoute().getRouter());
    this.app.use('/api/auth', new AuthRoute().getRouter());
    this.app.use('/api/messages', new MessageRoute().getRouter());
    this.app.use('/api/rooms', new RoomRoute().getRouter());
    this.app.use('/api/search', new SearchRoute().getRouter());
    this.app.use('/api/activities', new ActivityRoute().getRouter());
    this.app.use('/api/emergencywords', new EmergencyRoute().getRouter());
    this.app.use('/api/profiles', new ProfileRoute().getRouter());
  }

  private registerMiddlewares(): void {
    this.app.use(errorHandler);
  }

  private async startServer(): Promise<void> {
    await ESNDataSource.initialize();

    this.httpServer.listen(this.port, '0.0.0.0');
  }

  static async start(): Promise<void> {
    const appServer = new App();
    appServer.registerConfigs();
    appServer.registerRoutes();
    appServer.registerMiddlewares();
    await appServer.startServer();
    appServer.redisServer.startListening();
    ensureAdmin();
  }
}

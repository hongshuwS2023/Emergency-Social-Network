import {IncomingMessage, ServerResponse, Server as HttpServer} from 'http';
import {Server, Socket} from 'socket.io';
import {Repository} from 'typeorm';
import {User} from '../user/user.entity';
import ESNDataSource from './datasource';

export class SocketServer {
  private static instance: SocketServer;
  private userRepository: Repository<User>;
  private io: Server;

  private constructor() {
    // initialize the socket.io server
    this.io = new Server();
    this.userRepository = ESNDataSource.getRepository(User);
    this.registerEvents();
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  attach(
    server: HttpServer<typeof IncomingMessage, typeof ServerResponse>
  ): void {
    this.io.attach(server);
  }

  private registerEvents(): void {
    this.userRepository = ESNDataSource.getRepository(User);

    this.io.on('connection', async (socket: Socket) => {
      socket.on('disconnect', async () => {
        await this.broadcastOnlineUsers();
      });
    });
  }

  async broadcastOnlineUsers() {
    const users = await this.userRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });

    this.io.emit('online status', users);
  }

  async broadcastChatMessage(roomName: string, message: Object): Promise<void> {
    this.io.to(roomName).emit('chat message', message);
  }
}

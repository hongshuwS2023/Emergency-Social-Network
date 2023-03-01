import {Server} from 'socket.io';
import {Repository} from 'typeorm';
import {ErrorMessage} from '../exceptions/api.exception';
import {OnlineStatus, User} from '../user/user.entity';
import ESNDataSource from './datasource';

export class SocketServer {
  private static instance: SocketServer;
  private userRepository: Repository<User>;
  private static io: Server;

  private constructor() {
    // initialize the socket.io server
    SocketServer.io = new Server();
    this.userRepository = ESNDataSource.getRepository(User);
    this.registerEvents();
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  public attach(server: any): void {
    SocketServer.io.attach(server);
  }

  private registerEvents(): void {
    this.userRepository = ESNDataSource.getRepository(User);
    SocketServer.io.on('connection', async (socket: any) => {
      const userId = socket.handshake.query.userid;
      const user = await this.userRepository.findOneBy({id: userId});
      if (user) {
        user.onlineStatus = OnlineStatus.ONLINE;
        await this.userRepository.save(user);
        const users = await this.userRepository.find({
          order: {
            onlineStatus: 'ASC',
            username: 'ASC',
          },
        });
        SocketServer.io.emit('online status', users);
      }

      socket.on('disconnect', async () => {
        const user = await this.userRepository.findOneBy({id: userId});
        if (user) {
          user.onlineStatus = OnlineStatus.OFFLINE;
          await this.userRepository.save(user);
          const users = await this.userRepository.find({
            order: {
              onlineStatus: 'ASC',
              username: 'ASC',
            },
          });
          SocketServer.io.emit('online status', users);
        }
      });
    });
  }

  public static emitEvent(event: string, data: any): void {
    SocketServer.io.emit(event, data);
  }
}

import {Server} from 'socket.io';
import {Repository} from 'typeorm';
import {ErrorMessage} from '../exceptions/api.exception';
import {OnlineStatus, User} from '../user/user.entity';
import ESNDataSource from './datasource';

export class SocketIo {
  private static instance: SocketIo;
  private userRepository: Repository<User>;
  private io: Server;

  private constructor() {
    // initialize the socket.io server
    this.io = new Server();
    this.userRepository = ESNDataSource.getRepository(User);
    this.registerEvents();
  }

  public static getInstance(): SocketIo {
    if (!SocketIo.instance) {
      SocketIo.instance = new SocketIo();
    }
    return SocketIo.instance;
  }

  public attach(server: any): void {
    // attach the socket.io server to the HTTP server
    this.io.attach(server);
  }

  public getIO(): Server {
    return this.io;
  }

  private registerEvents(): void {
    this.userRepository = ESNDataSource.getRepository(User);
    this.io.on('connection', async (socket: any) => {
      const userId = socket.handshake.query.userid;
      const user = await this.userRepository.findOneBy({id: userId});
      if (user === null) {
        console.log(ErrorMessage.WRONGUSERNAME);
      } else {
        user.onlineStatus = OnlineStatus.ONLINE;
        await this.userRepository.save(user);
        const users = await this.userRepository.find({
          order: {
            onlineStatus: 'ASC',
            username: 'ASC',
          },
        });
        this.io.emit('online status', users);
      }

      socket.on('disconnect', async () => {
        const user = await this.userRepository.findOneBy({id: userId});
        if (user === null) {
          console.log(ErrorMessage.WRONGUSERNAME);
        } else {
          console.log(userId);
          user.onlineStatus = OnlineStatus.OFFLINE;
          await this.userRepository.save(user);
          const users = await this.userRepository.find({
            order: {
              onlineStatus: 'ASC',
              username: 'ASC',
            },
          });
          this.io.emit('online status', users);
          console.log('user disconnected');
        }
      });
    });
  }
}

const io = SocketIo.getInstance().getIO();
export {io};

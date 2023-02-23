import { stat } from 'fs';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { BadRequestException, ErrorMessage } from '../exceptions/api.exception';
import { OnlineStatus, User } from '../user/user.entity';
import ESNDataSource from './datasource';

export class SocketServer {
  static io: Server;
  private userRepository: Repository<User>;

  constructor(server: any) {
    SocketServer.io = new Server(server);
    this.userRepository = ESNDataSource.getRepository(User);

    SocketServer.io.on('connection', async (socket: any) => {
      console.log(socket.handshake.query);
      const userId = socket.handshake.query.userid;

      const user = await this.userRepository.findOneBy({ id: userId });
        if (user === null) {
          throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
        }
        console.log(userId);
        user.onlineStatus = OnlineStatus.ONLINE;
        await this.userRepository.save(user);
        const users = await this.userRepository.find({
          order: {
            onlineStatus: 'ASC',
            username: 'ASC',
          },
        });
        SocketServer.io.emit('online status', users);

      socket.on('chat message', (msg: string) => {
        console.log('message: ' + msg);
        SocketServer.io.emit('chat message', msg);
      });

      socket.on('disconnect', async (socket: any) => {

        const user = await this.userRepository.findOneBy({ id: userId });
        if (user === null) {
          throw new BadRequestException(ErrorMessage.WRONGUSERNAME);
        }
        console.log(userId);
        user.onlineStatus = OnlineStatus.OFFLINE;
        await this.userRepository.save(user);
        const users = await this.userRepository.find({
          order: {
            onlineStatus: 'ASC',
            username: 'ASC',
          },
        });
        SocketServer.io.emit('online status', users);
        console.log('user disconnected');
      });
    });
  }

}

import { stat } from 'fs';
import { Server, Socket } from 'socket.io';

export class SocketServer {
  static io: Server;
  
  constructor(server: any) {
    SocketServer.io = new Server(server);


    SocketServer.io.on('connection', (socket: Socket) => {
      console.log('a user connected');    

      socket.on('chat message', (msg: string) => {
        console.log('message: ' + msg);
        SocketServer.io.emit('chat message', msg);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

}

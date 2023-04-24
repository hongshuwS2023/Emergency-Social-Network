import {IncomingMessage, ServerResponse, Server as HttpServer} from 'http';
import {Server, Socket} from 'socket.io';
import {Repository} from 'typeorm';
import {Message} from '../message/message.entity';
import {OnlineStatus, User} from '../user/user.entity';
import ESNDataSource from './datasource';
import {Room} from '../room/room.entity';
import {Activity} from '../activity/activity.entity';

export class SocketServer {
  private static instance: SocketServer;
  private userRepository: Repository<User>;
  private io: Server;
  private userSocketMap: Map<string, string>;
  private activityRepository: Repository<Activity>;

  private constructor() {
    this.io = new Server();
    this.userRepository = ESNDataSource.getRepository(User);
    this.userSocketMap = new Map<string, string>();
    this.activityRepository = ESNDataSource.getRepository(Activity);
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
    this.io.on('connection', async (socket: Socket) => {
      await this.onConnection(socket);
      socket.on('disconnect', async () => {
        await this.disconnect(socket);
      });
    });
  }

  private async onConnection(socket: Socket): Promise<void> {
    const userId = String(socket.handshake.query.userid);
    const user = await this.userRepository.findOne({
      relations: {
        rooms: true,
        activities: true,
      },
      where: {
        id: userId,
      },
    });
    if (user !== null) {
      user.onlineStatus = OnlineStatus.ONLINE;
      await this.userRepository.save(user);
      await this.broadcastUsers();
      await this.broadcastActivity();
      this.userSocketMap.set(userId, socket.id);
      const previousRooms: Room[] = user.rooms;
      if (previousRooms) {
        previousRooms.forEach((room: Room) => {
          socket.join(room.id);
        });
      }
    }
  }

  private async disconnect(socket: Socket): Promise<void> {
    const userId = String(socket.handshake.query.userid);
    const user = await this.userRepository.findOneBy({id: userId});
    if (user !== null) {
      user.onlineStatus = OnlineStatus.OFFLINE;
      user.logoutTime = new Date().getTime().toString();
      await this.userRepository.save(user);
      this.userSocketMap.delete(userId);
      await this.broadcastUsers();
    }
  }

  async broadcastUsers() {
    const users = await this.userRepository.find({
      order: {
        onlineStatus: 'ASC',
        username: 'ASC',
      },
    });

    this.io.emit('all users', users);
  }

  async broadcastActivity() {
    const activities = await this.activityRepository.find({
      order: {
        status: 'ASC',
        name: 'ASC',
      },
    });

    this.io.emit('all activities', activities);
  }

  async broadcastActivityMembers(id: string) {
    const activity = await this.activityRepository.findOne({
      relations: ['members'],
      where: {
        id: id,
      },
    });

    this.io.emit('all activity members', activity!.members);
  }

  async broadcastActivityToVictim(
    id: string,
    activity: Activity
  ): Promise<void> {
    this.io.to(id).emit('activity victim notification', activity);
  }

  async broadcastChatMessage(
    roomName: string,
    message: Message
  ): Promise<void> {
    this.io.to(roomName).emit('chat message', message);
  }

  async broadcastJoinRoom(roomName: string, room: Room): Promise<void> {
    this.io.to(roomName).emit('join room', room);
  }

  async broadcastCreateGroup(room: Room): Promise<void> {
    this.io.emit('create group', room);
  }

  async joinRoom(user_id: string, room_id: string): Promise<void> {
    const socketId = this.userSocketMap.get(user_id);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(room_id);
      }
    }
  }

  async leaveRoom(user_id: string, room_id: string): Promise<void> {
    const socketId = this.userSocketMap.get(user_id);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(room_id);
      }
    }
  }

  sendEmergencyWordsChange(): void {
    this.io.emit('last-words-change', {});
  }

  notifyInactiveUser(userId: string) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('inactive-account', {});
        socket.disconnect(true);
      }
    }
  }
}

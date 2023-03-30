import {Message} from '../message/message.entity';
import {Room} from '../room/room.entity';
import {User} from '../user/user.entity';
import {v4 as uuid} from 'uuid';

interface IMessageFactory {
  createMessage(content: string, room: Room, sender: User): Message;
}

export class PublicMessageFactory implements IMessageFactory {
  createMessage(content: string, room: Room, sender: User): Message {
    return {
      id: uuid(),
      sender: sender,
      content: content,
      time: new Date().getTime().toString(),
      status: sender.status,
      room: room,
    };
  }
}

export class PrivateMessageFactory implements IMessageFactory {
  createMessage(content: string, room: Room, sender: User): Message {
    return {
      id: uuid(),
      sender: sender,
      content: content,
      time: new Date().getTime().toString(),
      status: sender.status,
      room: room,
    };
  }
}

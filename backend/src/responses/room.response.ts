import {Message} from '../message/message.entity';

export default class RoomResponse {
  id: number;
  name: string;
  messages: Message[];

  constructor(id: number, name: string, messages: Message[]) {
    this.id = id;
    this.name = name;
    this.messages = messages;
  }
}

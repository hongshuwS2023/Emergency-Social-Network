import { Status } from "../user/user.entity";

export default class MessageResponse {
    username: string;
    content: string;
    time: string;
    status: Status;
    constructor(username: string, content: string, time: string, status: Status) {
        this.username = username;
        this.content = content;
        this.time = time;
        this.status = status;
      }
  }
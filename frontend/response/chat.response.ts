export enum Status {
    OK,
    HELP,
    Emergency,
    Undefined,
}

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

export class OnlineStatusResponse {
    id: number;
    name: string;
    status: Status;
    onlineStatus: boolean;
    constructor(id: number, name: string, status: Status, onlineStatus: boolean) {
      this.id = id;
      this.name = name;
      this.status = status;
      this.onlineStatus = onlineStatus;
    }
  }

export function parseStatus(status: Status) {
    switch (status) {
        case Status.OK:
            return 'OK';
        case Status.Emergency:
            return 'Emergency';
        case Status.HELP:
            return 'Help';
        default:
            return 'Undefined';
    }

}


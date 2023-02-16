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


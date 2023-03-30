import { Status } from "../src/utils/enum";

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

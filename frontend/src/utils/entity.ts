import { OnlineStatus, Status } from "../../response/user.response";

export interface User {
    id: string;
    username: string;
    onlineStatus: OnlineStatus;
    status: Status;
}
export interface Room {
    id: string;
}

export interface Message {
    id: string;
    sender: User;
    status: Status;
    content: string;
    time: string;
    room: Room;
}

export interface LocalStorageInfo {
    id: string,
    username: string,
    token: string,
    room: string
}

export interface MessageBody {
    idList?: string[];
    userId?: string,
    content?: string
    roomId?: string
}

export interface MessageContent {
    username: string,
    status: Status,
    message: string,
    time: string
}
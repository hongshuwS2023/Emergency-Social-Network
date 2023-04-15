import { Context, ErrorMessage, OnlineStatus, Role, RoomType, Status, StatusCode } from "./enum";


export interface UserEntity {
    id: string,
    username: string,
    password: string;
    role: Role,
    status: Status,
    onlineStatus: OnlineStatus,
    statusTimeStamp: string,
    logoutTime: string,
    messages: MessageEntity[],
    rooms: RoomEntity[],
    historyStatus: HistoryStatus[]
}

export interface RoomEntity {
  id: string,
  messages: MessageEntity[];
  users: UserEntity[]
}

export interface MessageEntity {
    id: string,
    sender: UserEntity,
    content: string,
    time: string
    status: Status,
    room: RoomEntity
  }

export interface HistoryStatus {
    id: string,
    status: Status,
    timeStamp: string,
    user: UserEntity;
  }

export interface User {
    id: string;
    username: string;
    onlineStatus: OnlineStatus;
    status: Status;
}

export interface Room {
    id: string;
    type: RoomType;
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
    room: string,
    role?: number
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

export interface StatusHistoryContent {
    username: string,
    status: Status,
    time: string
}

export interface SearchInput {
    context: Context;
    criteria: string;
    user_id: string;
    room_id?: string;
  }

  export interface SearchResult{
    users?: UserEntity[],
    messages?: MessageEntity[],
    historyStatus?: HistoryStatus[]
  }

  export interface ApiException {
    status_code: StatusCode,
    message: ErrorMessage
}

export interface AuthResponse {
    id: number;
    token: string;
    expiresIn: number;
}

export interface UpdateChatGroupInput {
    userId: string;
    isJoin: boolean;
}

export interface CreateChatGroupInput {
    roomId: string;
    userId: string;
    type: RoomType;
}

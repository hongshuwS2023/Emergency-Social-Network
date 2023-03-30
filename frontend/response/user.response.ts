import { Status } from "../src/utils/enum";

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
      return "OK";
    case Status.EMERGENCY:
      return "Emergency";
    case Status.HELP:
      return "Help";
    default:
      return "Undefined";
  }
}

export const getFormattedDate = (timeStamp: number) => {
  // YYYY-MM-DD HH:MM:SS
  const date = new Date(timeStamp);
  return date.toLocaleString();
};

import { Status } from "../user/user.entity";

export default class AuthResponse {
  id: number;
  name: string;
  status: Status;
  token: string;
  expiresIn: number;
  constructor(id: number, name: string, status:Status, token: string) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.token = token;
    this.expiresIn = 3600;
  }
}

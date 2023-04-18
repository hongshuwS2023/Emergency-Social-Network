import { Role } from "../user/user.entity";

export default class TokenResponse {
  user_id: string;
  user_name: string;
  token: string;
  expires_in: string;
  role: Role;
  constructor(
    user_id: string,
    user_name: string,
    token: string,
    expires_in: string,
    role: Role
  ) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.token = token;
    this.expires_in = expires_in;
    this.role = role;
  }
}

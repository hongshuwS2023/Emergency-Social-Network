export default class AuthResponse {
  id: number;
  token: string;
  expiresIn: number;
  constructor(id: number, token: string) {
    this.id = id;
    this.token = token;
    this.expiresIn = 3600;
  }
}

export default class TokenResponse {
  userId: number;
  token: string;
  expiresIn: string;

  constructor(userId: number, token: string, expiresIn: string) {
    this.userId = userId;
    this.token = token;
    this.expiresIn = expiresIn;
  }
}

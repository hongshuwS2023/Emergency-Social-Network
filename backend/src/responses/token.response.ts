export default class TokenResponse {
  userId: string;
  token: string;
  expiresIn: string;

  constructor(userId: string, token: string, expiresIn: string) {
    this.userId = userId;
    this.token = token;
    this.expiresIn = expiresIn;
  }
}

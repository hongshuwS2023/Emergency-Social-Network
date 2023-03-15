export default class TokenResponse {
  user_id: string;
  user_name: string;
  token: string;
  expires_in: string;

  constructor(
    user_id: string,
    user_name: string,
    token: string,
    expires_in: string
  ) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.token = token;
    this.expires_in = expires_in;
  }
}

export default class OnlineStatusResponse {
    userId: number;
    onlineStatus: boolean;
    constructor(userId: number, onlineStatus:boolean) {
      this.userId = userId;
      this.onlineStatus = onlineStatus;
    }
  }
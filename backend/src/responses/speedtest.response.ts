export default class CreateSpeedTestResponse {
  private speedtestId: string;
  private roomId: string;

  constructor(speedtestId: string, roomId: string) {
    this.speedtestId = speedtestId;
    this.roomId = roomId;
  }
}

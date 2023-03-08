export default class CreateSpeedTestResponse {
  private speedtestId: number;
  private roomId: string;

  constructor(speedtestId: number, roomId: string) {
    this.speedtestId = speedtestId;
    this.roomId = roomId;
  }
}

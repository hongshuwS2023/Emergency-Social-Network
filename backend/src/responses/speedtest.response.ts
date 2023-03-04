export default class CreateSpeedTestResponse {
  private speedtestId: number;
  private roomId: number;
  private roomName: string;

  constructor(speedtestId: number, roomId: number, roomName: string) {
    this.speedtestId = speedtestId;
    this.roomId = roomId;
    this.roomName = roomName;
  }
}

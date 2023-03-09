export default class CreateSpeedTestResponse {
  private speedtest_id: string;
  private room_id: string;

  constructor(speedtest_id: string, room_id: string) {
    this.speedtest_id = speedtest_id;
    this.room_id = room_id;
  }
}

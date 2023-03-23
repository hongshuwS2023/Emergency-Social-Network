export default class searchResponse {
  data: string;

  constructor(data: string) {
    this.data = JSON.parse(data);
  }
}

export enum Context {
  CITIZENNAME,
  CITIZENSTATUS,
  ANNOUNCEMENT,
  PUBLICCHAT,
  PRIVATECHAT,
}

export default interface SearchInput {
  context: Context;
  criteria: string;
  room_id?: string;
}

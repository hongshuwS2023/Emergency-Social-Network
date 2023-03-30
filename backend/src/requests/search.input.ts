export enum Context {
  UNKNOWN,
  CITIZENNAME,
  CITIZENSTATUS,
  PUBLICCHAT,
  PRIVATECHAT
}

export default interface SearchInput {
  context: Context;
  criteria: string;
  user_id: string;
  room_id?: string;
}

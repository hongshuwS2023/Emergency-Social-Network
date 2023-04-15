import {PrimaryColumn, Column, Entity, OneToMany, ManyToMany} from 'typeorm';
import {User} from '../user/user.entity';
import {Message} from '../message/message.entity';

export enum RoomType {
  UNDEFINED,
  EXCAVATE,
  SEARCH,
  RESCUE,
  MONITOR,
}

@Entity()
export class Room {
  @PrimaryColumn()
  id!: string;

  @Column({default: RoomType.UNDEFINED})
  type!: RoomType;

  @OneToMany(() => Message, message => message.room, {cascade: true})
  messages!: Message[];

  @ManyToMany(() => User, user => user.rooms)
  users!: User[];
}

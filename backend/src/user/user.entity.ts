import {
  PrimaryColumn,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import {Message} from '../message/message.entity';
import {Room} from '../room/room.entity';
import {SpeedTest} from '../speedtest/speedtest.entity';

export enum Role {
  ADMIN,
  COORDINATOR,
  CITIZEN,
}

export enum OnlineStatus {
  ONLINE,
  OFFLINE,
}

export enum Status {
  UNDEFINED,
  OK,
  HELP,
  EMERGENCY,
}

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({select: false})
  password!: string;

  @Column()
  role!: Role;

  @Column()
  status!: Status;

  @Column()
  onlineStatus!: OnlineStatus;

  @Column()
  statusTimeStamp!: string;

  @OneToMany(() => Message, message => message.sender)
  messages!: Message[];

  @ManyToMany(() => Room, room => room.users)
  @JoinTable()
  rooms!: Room[];

  @OneToMany(() => SpeedTest, speedtest => speedtest.admin)
  speedtests!: SpeedTest[];
}

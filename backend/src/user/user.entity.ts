import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Message} from '../message/message.entity';
import {Exclude} from 'class-transformer';
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
  OK,
  HELP,
  Emergency,
  Undefined,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column()
  role!: Role;

  @Column()
  status!: Status;

  @Column()
  onlineStatus!: OnlineStatus;

  @Column()
  statusTimeStamp!: string;

  @OneToMany(() => Message, message => message.user)
  messages!: Message[];

  @ManyToMany(() => Room)
  @JoinTable()
  rooms!: Room[];

  @OneToMany(() => SpeedTest, speedtest => speedtest.admin)
  speedtests!: SpeedTest[];
}

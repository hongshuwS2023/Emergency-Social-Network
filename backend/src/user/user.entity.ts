import {
  PrimaryColumn,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import {Activity} from '../activity/activity.entity';
import {Message} from '../message/message.entity';
import {Room} from '../room/room.entity';
import {HistoryStatus} from '../status/status.entity';

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
  EMERGENCY,
}

export enum AccountStatus {
  ACTIVE,
  INACTIVE,
}

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({select: false})
  password!: string;

  @Column({default: Role.CITIZEN})
  role!: Role;

  @Column({default: Status.OK})
  status!: Status;

  @Column({default: OnlineStatus.ONLINE})
  onlineStatus!: OnlineStatus;

  @Column({default: ''})
  statusTimeStamp!: string;

  @Column({default: '-1'})
  logoutTime!: string;

  @OneToMany(() => Message, message => message.sender)
  messages!: Message[];

  @ManyToMany(() => Room, room => room.users)
  @JoinTable()
  rooms!: Room[];

  @OneToMany(() => HistoryStatus, status => status.user)
  historyStatus!: HistoryStatus[];

  @Column({default: AccountStatus.ACTIVE})
  accountStatus!: AccountStatus;

  @OneToMany(() => Activity, activity => activity.victim)
  activityVictims!: Activity[];

  @ManyToMany(() => Activity, activity => activity.members)
  @JoinTable()
  activities!: Activity[];
}

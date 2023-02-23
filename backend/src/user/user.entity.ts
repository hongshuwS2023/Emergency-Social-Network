/* eslint-disable @typescript-eslint/no-unused-vars */
import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Message } from '../message/message.entity';
import { Exclude } from 'class-transformer';
import { Room } from '../room/room.entity';

export enum Role {
  ADMIN,
  COORDINATOR,
  CITIZEN,
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

  @Column({default:false})
  onlineStatus!: Boolean;

  @OneToMany(() => Message, (message) => message.user)
  messages!: Message[];

  @ManyToMany(() => Room)
  @JoinTable()
  rooms!: Room[];
}

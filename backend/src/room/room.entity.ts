/* eslint-disable @typescript-eslint/no-unused-vars */
import {Entity, OneToMany, ManyToMany,PrimaryColumn} from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';


@Entity()
export class Room {
  @PrimaryColumn()
  id!: string;

  @ManyToMany(() => User)
    users!: User[]

  @OneToMany(() => Message, (message) => message.room)
  messages!: Message[]
}
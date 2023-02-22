/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import {User} from '../user/user.entity';
import {Message} from '../message/message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Message, message => message.room)
  messages!: Message[];

  @ManyToMany(() => User)
  users!: User[];
}

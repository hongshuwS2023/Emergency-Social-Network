/* eslint-disable @typescript-eslint/no-unused-vars */
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.messages)
  user!: User;

  @Column()
  content!: string;

  @Column()
  time!: string;

  @Column({default: 0})
  room!: number;
}

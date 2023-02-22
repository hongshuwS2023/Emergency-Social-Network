import {Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Message} from '../message/message.entity';
import {User} from '../user/user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  roomId!: number;

  @ManyToMany(() => User, user => user.rooms)
  users!: User[];

  @OneToMany(() => Message, message => message.room)
  messages!: Message[];
}

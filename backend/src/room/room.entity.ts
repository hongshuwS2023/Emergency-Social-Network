import {
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import {User} from '../user/user.entity';
import {Message} from '../message/message.entity';

@Entity()
export class Room {
  @Column()
  id!: string;

  @OneToMany(() => Message, message => message.room)
  messages!: Message[];

  @ManyToMany(() => User, user => user.rooms)
  users!: User[];
}

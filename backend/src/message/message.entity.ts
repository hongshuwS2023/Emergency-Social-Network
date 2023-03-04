import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Room} from '../room/room.entity';
import {User} from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  sender!: User;

  @Column()
  content!: string;

  @Column()
  time!: string;

  @ManyToOne(() => Room)
  room!: Room;
}

import {PrimaryColumn, Column, Entity, ManyToOne} from 'typeorm';
import {Room} from '../room/room.entity';
import {Status, User} from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User)
  sender!: User;

  @Column()
  content!: string;

  @Column()
  time!: string;

  @Column()
  status!: Status;

  @ManyToOne(() => Room)
  room!: Room;
}

import {PrimaryColumn, Column, Entity, ManyToOne} from 'typeorm';
import {Room} from '../room/room.entity';
import {User} from '../user/user.entity';

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

  @ManyToOne(() => Room)
  room!: Room;
}

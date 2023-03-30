import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {Status, User} from '../user/user.entity';

@Entity()
export class HistoryStatus {
  @PrimaryColumn()
  id!: string;

  @Column()
  status!: Status;

  @Column({default: ''})
  timeStamp!: string;

  @ManyToOne(() => User)
  user!: User;
}

import {PrimaryColumn, Column, Entity, ManyToMany, ManyToOne} from 'typeorm';
import {User} from '../user/user.entity';

export enum ActivityStatus {
  UNKNOWN,
  INCOMPLETED,
  COMPLETED,
}

@Entity()
export class Activity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User)
  victim!: User;

  @Column()
  description!: string;

  @Column()
  status!: ActivityStatus;

  @ManyToMany(() => User, user => user.activities)
  members!: User[];
}

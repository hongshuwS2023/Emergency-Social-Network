import {PrimaryColumn, Column, Entity, ManyToOne} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class SpeedTest {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, user => user.speedtests)
  admin!: User;

  @Column()
  interval!: number;

  @Column()
  duration!: number;

  @Column()
  startTime!: string;

  @Column({default: 0})
  postRate!: number;

  @Column({default: 0})
  getRate!: number;
}

import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class SpeedTest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.speedtests)
  admin!: User;

  @Column()
  interval!: number;

  @Column()
  duration!: number;

  @Column({default: 0})
  postRate!: number;

  @Column({default: 0})
  getRate!: number;
}

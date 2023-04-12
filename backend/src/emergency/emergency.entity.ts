import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class EmergencyWords {
  @PrimaryColumn()
  id!: string;

  @Column()
  sender!: string;

  @Column()
  contact!: string;

  @Column()
  content!: string;

  @Column()
  time_created!: string;

  @Column()
  email!: string;

  @Column()
  timeout!: number;

  @Column()
  time_to_send!: string;
}

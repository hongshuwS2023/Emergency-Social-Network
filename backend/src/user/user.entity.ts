/* eslint-disable @typescript-eslint/no-unused-vars */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum Role {
  ADMIN,
  COORDINATOR,
  CITIZEN,
}

export enum Status {
  OK,
  HELP,
  Emergency,
  Undefined,
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  role!: Role;

  @Column()
  status!: Status;
}

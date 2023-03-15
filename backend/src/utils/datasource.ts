import {DataSource} from 'typeorm';
import dotenv from 'dotenv';
import {User} from '../user/user.entity';
import {Message} from '../message/message.entity';
import {Room} from '../room/room.entity';
import {SpeedTest} from '../speedtest/speedtest.entity';

const env = `.env.${process.env.NODE_ENV}`;
dotenv.config({path: env});

let ESNDataSource: DataSource;
if (process.env.NODE_ENV === 'test') {
  ESNDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Message, Room, SpeedTest],
    synchronize: true,
    logging: false,
  })
}
else {
  ESNDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Message, Room, SpeedTest],
    dropSchema: process.env.NODE_ENV === 'prod' ? false : true,
    logging: process.env.NODE_ENV === 'prod' ? false : true,
    synchronize: true,
  });
}

export default ESNDataSource;

import {DataSource} from 'typeorm';
import dotenv from 'dotenv';
import {User} from '../user/user.entity';
import { Message } from '../message/message.entity';

const args = process.argv;
const mode = args[3];
const env = `.env.${mode}`;
dotenv.config({path: env});

const ESNDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Message],
  dropSchema: process.env.NODE_ENV === 'prod' ? false : true,
  logging: process.env.NODE_ENV === 'prod' ? false : true,
  synchronize: true,
});

export default ESNDataSource;

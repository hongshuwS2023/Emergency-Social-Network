import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import UserRoute from '../../src/user/user.route';
import RoomRoute from '../../src/room/room.route';
import MessageRoute from '../../src/message/message.route';
import {errorHandler} from '../../src/middleware/error.middleware';
import request from 'supertest';

const app = express();
const httpServer = createServer(app);

beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
  app.use('/api/users', new UserRoute().getRouter());
  app.use('/api/messages', new MessageRoute().getRouter());
  app.use('/api/rooms', new RoomRoute().getRouter());
  app.use(errorHandler);
});

beforeEach(async () => {
  await ESNDataSource.initialize();
});
afterEach(async () => {
  await ESNDataSource.destroy();
});
afterAll(async () => {
  httpServer.close();
});

const testUser = {
  username: 'test-user',
  password: 'test-password',
};

describe('Can post a message', () => {
  it('Can post a message ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const postMessageInput = {
      userId: userId,
      content: 'hello',
      roomId: 'public',
    };

    const postMessageRes = await request(httpServer)
      .post('/api/messages')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send(postMessageInput);
    expect(postMessageRes.status).toEqual(200);
    expect(postMessageRes.body.content).toEqual('hello');
  });
});

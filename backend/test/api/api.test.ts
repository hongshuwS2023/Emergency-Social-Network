import {createServer} from 'http';
import express from 'express';
import {User} from '../../src/user/user.entity';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import UserRoute from '../../src/user/user.route';
import RoomRoute from '../../src/room/room.route';
import SearchRoute from '../../src/search/search.route';
import MessageRoute from '../../src/message/message.route';
import {errorHandler} from '../../src/middleware/error.middleware';
const request = require('supertest');

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
  app.use('/api/search', new SearchRoute().getRouter());
  app.use(errorHandler);
  const port = 3001;
  try {
    //await ESNDataSource.initialize();

    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`server started at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  await ESNDataSource.initialize();
  //httpServer.close();
});
afterEach(async () => {
  await ESNDataSource.destroy();
  //httpServer.close();
});
afterAll(async () => {
  httpServer.close();
});

const testUser = {
  username: 'test-user',
  password: 'test-password',
};

describe('Can post a new user', () => {
  it('Can post a new user ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    expect(postUserRes.status).toEqual(200);
    expect(postUserRes.body.user_name).toEqual(testUser.username);
    expect(postUserRes.body.token).not.toBe(null);

    const getUserRes = await request(httpServer)
      .get('/api/users')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const users = getUserRes.body;
    const newUser = users.find((u: User) => u.username === testUser.username);
    expect(newUser.username).toBe(testUser.username);
  });
});

describe('Can login a user', () => {
  it('Can login a user', async () => {
    await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);

    const postUserRes = await request(httpServer)
      .post('/api/auth/login')
      .send(testUser);
    expect(postUserRes.status).toEqual(200);
    expect(postUserRes.body.user_name).toEqual(testUser.username);
    expect(postUserRes.body.token).not.toBe(null);
  });
});

describe('Can update a user', () => {
  it('Can update a user, for example updating the status', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;

    const putUserRes = await request(httpServer)
      .put('/api/users')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: userId,
        status: 1,
      });
    expect(putUserRes.status).toEqual(200);
    expect(putUserRes.body.status).toEqual(1);

    const getUserRes = await request(httpServer)
      .get('/api/users/' + userId)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const user = getUserRes.body;

    expect(user.status).toBe(1);
  });
});

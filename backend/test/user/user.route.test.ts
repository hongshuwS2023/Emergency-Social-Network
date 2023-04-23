import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import UserRoute from '../../src/user/user.route';
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

const testUser2 = {
  username: 'test-user2',
  password: 'test-password2',
};

describe('Can delete a user', () => {
  it('Can delete a user from the database', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;

    const deleteUserRes = await request(httpServer)
      .delete('/api/users/' + userId)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    expect(deleteUserRes.status).toEqual(200);
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

describe('Can get all users', () => {
  it('Can get all users', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    await request(httpServer).post('/api/auth/register').send(testUser2);

    const getUserRes = await request(httpServer)
      .get('/api/users')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    expect(getUserRes.status).toEqual(200);
    expect(getUserRes.body.length).toEqual(2);
  });
});

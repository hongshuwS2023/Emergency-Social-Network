import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import {errorHandler} from '../../src/middleware/error.middleware';
import request from 'supertest';

const app = express();
const httpServer = createServer(app);

beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
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

describe('Can post a new user', () => {
  it('Can post a new user ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    expect(postUserRes.status).toEqual(200);
    expect(postUserRes.body.user_name).toEqual(testUser.username);
    expect(postUserRes.body.token).not.toBe(null);
  });
});

describe('Can login a user', () => {
  it('Can login a user', async () => {
    await request(httpServer).post('/api/auth/register').send(testUser);

    const postUserRes = await request(httpServer)
      .post('/api/auth/login')
      .send(testUser);
    expect(postUserRes.status).toEqual(200);
    expect(postUserRes.body.user_name).toEqual(testUser.username);
    expect(postUserRes.body.token).not.toBe(null);
  });
});

describe('Can logout a user', () => {
  it('Can logout a user', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);

    const logoutUserRes = await request(httpServer)
      .post('/api/auth/logout')
      .send({id: postUserRes.body.user_id});
    expect(logoutUserRes.status).toEqual(200);
  });
});

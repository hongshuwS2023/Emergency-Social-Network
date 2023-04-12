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
import EmergencyRoute from '../../src/emergency/emergency.route';
import { RedisServer } from '../../src/utils/redisServer';
import request from 'supertest';

const app = express();
const httpServer = createServer(app);

jest
  .spyOn(RedisServer, 'getInstance').mockImplementation(() => {
    return null as any;
  });


beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
  app.use('/api/users', new UserRoute().getRouter());
  app.use('/api/messages', new MessageRoute().getRouter());
  app.use('/api/rooms', new RoomRoute().getRouter());
  app.use('/api/search', new SearchRoute().getRouter());
  app.use('/api/emergency', new EmergencyRoute().getRouter());
  app.use(errorHandler);
  const port = 3001;
  try {

    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`server started at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
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
    await request(httpServer).post('/api/auth/register').send(testUser);

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


describe('Can create an emergency words', () => {
  it('Create an emergency words using POST /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const postEmergencyWords = await request(httpServer)
      .post('/api/emergency')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    expect(postEmergencyWords.status).toEqual(200);
    expect(postEmergencyWords.body.id).not.toBeNull();
  });
});

describe('Can get an emergency words', () => {
  it('Get an emergency words using GET /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    await request(httpServer)
      .post('/api/emergency')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    
    const res = await request(httpServer)
      .get('/api/emergency/?userid=' + userId + '&username=' + testUser.username)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(res.status).toEqual(200);
    expect(res.body.unsent).not.toBeNull();
  });
});

describe('Can delete an emergency words', () => {
  it('Delete an emergency words using Delete /api/emergency/:id', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const words = await request(httpServer)
      .post('/api/emergency')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    
    const res = await request(httpServer)
      .delete('/api/emergency/:' + words.body.id)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(res.status).toEqual(200);
  });
});

describe('Can update an emergency words', () => {
  it('Update an emergency words using PUT /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const words = await request(httpServer)
      .post('/api/emergency')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    
    const res = await request(httpServer)
      .put('/api/emergency')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: words.body.id,
        user_id: userId,
      });

    expect(res.status).toEqual(200);
  });
});
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
  app.use('/api/search', new SearchRoute().getRouter());
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

describe('Can create a chat group', () => {
  it('Can create a new chat group ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;

    const postGroupChatRes = await request(httpServer)
      .post('/api/rooms/chatgroup')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        userId: userId,
        roomId: 'test-room',
        type: '1',
      });
    expect(postGroupChatRes.status).toEqual(200);
    expect(postGroupChatRes.body.type).toBe(1);
    const getPostRes = await request(httpServer)
      .get('/api/rooms/test-room')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const room = getPostRes.body;
    expect(room.type).toBe(1);
    expect(room.id).toBe('test-room');
  });
});

describe('Can join and leave the chat group', () => {
  it('Can leave the new chat group ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;

    const postGroupChatRes = await request(httpServer)
      .post('/api/rooms/chatgroup')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        userId: userId,
        roomId: 'test-room',
        type: '1',
      });
    expect(postGroupChatRes.status).toEqual(200);
    expect(postGroupChatRes.body.type).toBe(1);
    const getPostRes = await request(httpServer)
      .get('/api/rooms/test-room')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const room = getPostRes.body;
    expect(room.type).toBe(1);
    expect(room.id).toBe('test-room');
    const leaveRoomRes = await request(httpServer)
      .put('/api/rooms/test-room')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        userId: userId,
        isJoin: false,
      });
    expect(leaveRoomRes.status).toEqual(200);
    expect(leaveRoomRes.body.users.length).toEqual(0);
  });
});

describe('Can get all the chat groups created', () => {
  it('Can get all the chat groups ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const postGroupChatRes = await request(httpServer)
      .post('/api/rooms/chatgroup')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        userId: userId,
        roomId: 'test-room',
        type: '1',
      });
    expect(postGroupChatRes.status).toEqual(200);
    expect(postGroupChatRes.body.type).toBe(1);
    const getPostRes = await request(httpServer)
      .get('/api/rooms')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const rooms = getPostRes.body;
    expect(rooms.length).toBe(1);
    expect(rooms[0].type).toBe(1);
    expect(rooms[0].id).toBe('test-room');
  });
});

describe('Can create a normal private chat room', () => {
  it('Can create a new private chat room ', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;

    const postGroupChatRes = await request(httpServer)
      .post('/api/rooms/')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        idList: [userId],
      });
    expect(postGroupChatRes.status).toEqual(200);
    expect(postGroupChatRes.body.type).toBe(0);
    const getPostRes = await request(httpServer)
      .get('/api/rooms/test-user')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();
    const room = getPostRes.body;
    expect(room.type).toBe(0);
    expect(room.id).toBe('test-user');
  });
});

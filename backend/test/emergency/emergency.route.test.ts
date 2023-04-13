import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import {errorHandler} from '../../src/middleware/error.middleware';
import EmergencyRoute from '../../src/emergency/emergency.route';
import {RedisServer} from '../../src/utils/redisServer';
import request from 'supertest';

const app = express();
const httpServer = createServer(app);

const emergencyRoute = new EmergencyRoute();

jest.spyOn(RedisServer, 'getInstance').mockImplementation(() => {
  return <RedisServer>(<unknown>null);
});
jest
  .spyOn(emergencyRoute.emergencyController, 'removeEmergencyWords')
  .mockImplementation(async () => {
    return;
  });

jest
  .spyOn(emergencyRoute.emergencyController, 'setEmergencyWords')
  .mockImplementation(async () => {
    return;
  });

jest
  .spyOn(emergencyRoute.emergencyController, 'broadcastEmergencyWords')
  .mockImplementation(() => {
    return;
  });

beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
  app.use('/api/emergencywords', emergencyRoute.getRouter());
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

describe('Can create an emergency words', () => {
  it('Create an emergency words using POST /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const postEmergencyWords = await request(httpServer)
      .post('/api/emergencywords')
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

  it('Throw an exception when providing an invalid user_id to use POST /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const res = await request(httpServer)
      .post('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: 0,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    expect(res.status).toEqual(200);
    expect(JSON.parse(res.text).status_code).toEqual(404);
  });
});

describe('Can get an emergency words', () => {
  it('Get an emergency words using GET /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    await request(httpServer)
      .post('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });

    const res = await request(httpServer)
      .get(
        '/api/emergencywords/?userid=' +
          userId +
          '&username=' +
          testUser.username
      )
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(res.status).toEqual(200);
    expect(res.body.unsent).not.toBeNull();
  });

  it('Get an exception using GET /api/emergency using invalid cred', async () => {
    const res = await request(httpServer)
      .get('/api/emergencywords/?userid=0' + '&username=' + testUser.username)
      .send();

    expect(res.status).toEqual(200);
    expect(res.text).not.toBeNull();
  });
});

describe('Can delete an emergency words', () => {
  it('Delete an emergency words using Delete /api/emergency/:id', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const words = await request(httpServer)
      .post('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });
    const res = await request(httpServer)
      .delete('/api/emergencywords/' + words.body.id)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(res.status).toEqual(200);
    expect(res.text).toBe('OK');
  });

  it('throw an error when using Delete /api/emergency/:id with an invalid id', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);

    const res = await request(httpServer)
      .delete('/api/emergencywords/0')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(res.status).toEqual(200);
    expect(JSON.parse(res.text).status_code).toBe(404);
  });
});

describe('Can update an emergency words', () => {
  it('Update an emergency words using PUT /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const words = await request(httpServer)
      .post('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        user_id: userId,
        contact: testUser.username,
        email: '',
        timeout: 1,
        content: '111',
      });

    const res = await request(httpServer)
      .put('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: words.body.id,
        user_id: userId,
        content: 'abc',
      });

    expect(res.status).toEqual(200);
    expect(res.body.content).toBe('abc');
  });

  it('Throw an expection when updating an invalid emergency words using PUT /api/emergency', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);

    const res = await request(httpServer)
      .put('/api/emergencywords')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: 0,
        user_id: 'abc',
        content: 'abc',
      });

    expect(res.status).toEqual(200);
    expect(JSON.parse(res.text).status_code).toEqual(404);
  });
});

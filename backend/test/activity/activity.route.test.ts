import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import ActivityRoute from '../../src/activity/activity.route';
import {errorHandler} from '../../src/middleware/error.middleware';
import request from 'supertest';

const app = express();
const httpServer = createServer(app);

beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
  app.use('/api/activities', new ActivityRoute().getRouter());
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

describe('Can create an activity', () => {
  it('Create an activity using POST /api/activities', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const activity = await request(httpServer)
      .post('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: userId,
        name: 'test_activity',
        victimName: testUser.username,
        description: 'test_description',
      });

    expect(activity.status).toEqual(200);
    expect(activity.body.id).not.toBeNull();
  });
});

describe('Can update an activity', () => {
  it('Update an activity using PUT /api/activities', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const activity = await request(httpServer)
      .post('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: userId,
        name: 'test_activity',
        victimName: testUser.username,
        description: 'test_description',
      });

    const updateActivityReq = await request(httpServer)
      .put('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: activity.body.id,
        userId: userId,
        name: 'test_activity_1',
        description: 'test_description_1',
      });

    expect(updateActivityReq.status).toEqual(200);
  });
});

describe('Can get all activities', () => {
  it('Can get all activities using GET /api/activities', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    await request(httpServer)
      .post('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: userId,
        name: 'test_activity',
        victimName: testUser.username,
        description: 'test_description',
      });

    const getActivityReq = await request(httpServer)
      .get('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(getActivityReq.status).toEqual(200);
  });
});

describe('Can get a specific activity', () => {
  it('Can get a specific activity using GET /api/activity/id', async () => {
    const postUserRes = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);
    const userId = postUserRes.body.user_id;
    const activity = await request(httpServer)
      .post('/api/activities')
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send({
        id: userId,
        name: 'test_activity',
        victimName: testUser.username,
        description: 'test_description',
      });

    const getActivityReq = await request(httpServer)
      .get(`/api/activities/${activity.body.id}`)
      .set('authorization', 'Token ' + postUserRes.body.token)
      .send();

    expect(getActivityReq.status).toEqual(200);
  });
});

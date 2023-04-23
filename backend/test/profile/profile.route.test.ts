import {createServer} from 'http';
import express from 'express';
import AuthRoute from '../../src/auth/auth.route';
import {restVerifyToken} from '../../src/middleware/auth.middleware';
import ESNDataSource from '../../src/utils/datasource';
import {errorHandler} from '../../src/middleware/error.middleware';
import ProfileRoute from '../../src/profile/profile.route';
import request from 'supertest';
import {User} from '../../src/user/user.entity';

const app = express();
const httpServer = createServer(app);

beforeAll(async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(restVerifyToken);
  app.use('/api/auth', new AuthRoute().getRouter());
  app.use('/api/profiles', new ProfileRoute().getRouter());
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

describe('Can get a user profile', () => {
  it('Can get a user profile', async () => {
    await request(httpServer).post('/api/auth/register').send(testUser);
    const userRepository = ESNDataSource.getRepository(User);
    const user = await userRepository.findOneBy({username: testUser.username});
    user!.role = 0;
    if (user) {
      await userRepository.save(user);
    }
    const loginUserRes = await request(httpServer)
      .post('/api/auth/login')
      .send(testUser);
    const userId = loginUserRes.body.user_id;

    const getProfileRes = await request(httpServer)
      .get('/api/profiles/' + userId)
      .set('authorization', 'Token ' + loginUserRes.body.token)
      .send();
    expect(getProfileRes.status).toEqual(200);
    expect(getProfileRes.body.username).toEqual(testUser.username);
  });
});

describe('Can update a user profile', () => {
  it('Can update a user profile', async () => {
    await request(httpServer).post('/api/auth/register').send(testUser);
    const userRepository = ESNDataSource.getRepository(User);
    const user = await userRepository.findOneBy({username: testUser.username});
    user!.role = 0;
    if (user) {
      await userRepository.save(user);
    }
    const loginUserRes = await request(httpServer)
      .post('/api/auth/login')
      .send(testUser);
    const userId = loginUserRes.body.user_id;

    const updateUserProfileInput = {
      id: userId,
      role: 0,
      accountStatus: 1,
      username: 'new-username',
    };
    const getProfileRes = await request(httpServer)
      .put('/api/profiles')
      .set('authorization', 'Token ' + loginUserRes.body.token)
      .send(updateUserProfileInput);
    expect(getProfileRes.status).toEqual(200);
    expect(getProfileRes.body.username).toEqual('new-username');
    expect(getProfileRes.body.role).toEqual(0);
    expect(getProfileRes.body.accountStatus).toEqual(1);
  });
});

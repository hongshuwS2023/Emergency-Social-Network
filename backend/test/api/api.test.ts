// import {Room} from '../../src/room/room.entity';
// import {User} from '../../src/user/user.entity';
// import ESNDataSource from '../../src/utils/datasource';

// const userRepository = ESNDataSource.getRepository(User);
// beforeEach(async () => {
//   await ESNDataSource.initialize();
//   const user = userRepository.create();
//   user.id = 'test_id';
//   user.username = 'test_username';
//   user.password = 'test_password';
//   user.statusTimeStamp = new Date().getTime().toString();
//   await userRepository.save(user);
//   const roomRepository = ESNDataSource.getRepository(Room);
//   const room = roomRepository.create();
//   room.id = 'public';
//   await roomRepository.save(room);
// });

// afterEach(async () => {
//   await ESNDataSource.destroy();
// });

// const PORT = 3001;
// const HOST = 'http://localhost:' + PORT;

// const testUser = {
//   username: 'test-user',
//   password: 'test-password',
// };

// describe('Can post a new user', () => {
//   it('Can post a new user ', async () => {
//     await fetch(HOST + '/api/auth/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(testUser),
//     }).then((res, err) => {
//       expect(err).toBe(undefined);
//       expect(res.statusCode).toBe(200);
//     });
//   });
// });

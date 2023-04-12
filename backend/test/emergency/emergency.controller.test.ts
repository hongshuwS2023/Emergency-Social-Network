import EmergencyWordsController from '../../src/emergency/emergency.controller';
import {EmergencyWords} from '../../src/emergency/emergency.entity';
import {PostEmergencyWordsInput, UpdateEmergencyWordsInput} from '../../src/requests/emergencywords.input';
import { BadRequestException, NotFoundException } from '../../src/responses/api.exception';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';

const emergencyWordsController = new EmergencyWordsController();
const emergencyRepository = ESNDataSource.getRepository(EmergencyWords);
const userRepository = ESNDataSource.getRepository(User);

const removeSpy = jest
  .spyOn(emergencyWordsController, 'removeEmergencyWords')
  .mockImplementation(async (..._:any) => {
    return;
  });
const setSpy = jest
  .spyOn(emergencyWordsController, 'setEmergencyWords')
  .mockImplementation(async (..._:any) => {
    return;
  });
const broadCastSpy = jest
  .spyOn(emergencyWordsController, 'broadcastEmergencyWords')
  .mockImplementation(async () => {
    return;
  });

beforeEach(async () => {
  await ESNDataSource.initialize();
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('getUnsentEmergencyWordsByUserId', () => {
  it('Should successfully return an unsent message when such a message exists', async () => {
    const words = emergencyRepository.create();

    words.id = 'test-id';
    words.email = 'abc';
    words.contact = 'abc';
    words.content = 'abc';
    words.sender = 'abc';
    words.time_created = Date.now().toString();
    words.timeout = 1;
    words.time_to_send = (Date.now() + Date.now()).toString();

    await emergencyRepository.save(words);

    const res = await emergencyWordsController.getUnsentEmergencyWordsByUserId(
      'abc'
    );

    expect(res).not.toBeNull();
    expect(res).toStrictEqual(words);
  });

  it('Should return null when no message exists', async () => {
    const words = emergencyRepository.create();

    words.id = 'test-id';
    words.email = 'abc';
    words.contact = 'abc';
    words.content = 'abc';
    words.sender = 'abc';
    words.time_created = Date.now().toString();
    words.timeout = 1;
    words.time_to_send = '0';

    await emergencyRepository.save(words);

    const res = await emergencyWordsController.getUnsentEmergencyWordsByUserId(
      'abc'
    );

    expect(res).toBeNull();
  });
});

describe('getEmergencyWords', () => {
  it('Should successfully return the words when the messages exists', async () => {
    const words = emergencyRepository.create();

    words.id = 'test-id';
    words.email = 'abc';
    words.contact = 'all';
    words.content = 'abc';
    words.sender = 'abc';
    words.time_created = Date.now().toString();
    words.timeout = 1;
    words.time_to_send = '0';

    await emergencyRepository.save(words);

    const res = await emergencyWordsController.getEmergencyWords('abc', 'abc');

    expect(res).not.toBeNull();
    expect(res.unsent).toBeNull();
    expect(res.availables.length).toEqual(1);
    expect(res.availables[0]).toStrictEqual(words);
  });

  it('Should return null when no message exists', async () => {
    const res = await emergencyWordsController.getEmergencyWords('abc', 'abc');

    expect(res).not.toBeNull();
    expect(res.availables.length).toEqual(0);
    expect(res.unsent).toBeNull();
  });
});

describe('postEmergencyWords', () => {
  it('Should successfully return the words when the messages exists', async () => {
    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);
    const words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    const res = await emergencyWordsController.postEmergencyWords(words);
    expect(res).not.toBeNull();
    expect(res.timeout).toEqual(0);
    expect(res.contact).toBe('test_username');
    expect(res.email).toBe('');

    expect(setSpy).toBeCalled();
  });

  it('Should throw expections when the any of the inputs is not valid', async () => {
    let words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    try {
      await emergencyWordsController.postEmergencyWords(words);
    }
    catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }

    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);

    words = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '',
    };

    try {
      await emergencyWordsController.postEmergencyWords(words);
    }
    catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }

    words = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 10,
      content: '123',
    };

    await emergencyWordsController.postEmergencyWords(words);

    try {
      await emergencyWordsController.postEmergencyWords(words);
    }
    catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});


describe('updateEmergencyWords', () => {
  it('Should successfully update the words when the inputs are valid', async () => {
    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);
    const words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    const res = await emergencyWordsController.postEmergencyWords(words);
    
    let body: UpdateEmergencyWordsInput = {
      id: res.id,
      user_id: user.id
    };

    let updated = await emergencyWordsController.updateEmergencyWords(body);
    res.time_created = updated.time_created;
    res.time_to_send = updated.time_to_send;
    expect(updated).toStrictEqual(res);

    body = {
      id: res.id,
      user_id: 'x',
      contact: 'all'
    };

    updated = await emergencyWordsController.updateEmergencyWords(body);
    res.contact = 'all';
    res.time_created = updated.time_created;
    res.time_to_send = updated.time_to_send;
    expect(updated).toStrictEqual(res);
    expect(removeSpy).toBeCalled();
    expect(setSpy).toBeCalled();
  });

  it('Should successfully update the words when the inputs are valid', async () => {
    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);
    const words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    const res = await emergencyWordsController.postEmergencyWords(words);
    
    let body: UpdateEmergencyWordsInput = {
      id: 'x',
      user_id: user.id
    };

    try {
      await emergencyWordsController.updateEmergencyWords(body);
    }
    catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }

    body = {
      id: res.id,
      user_id: 'x',
      contact: 'x'
    };

    try {
      await emergencyWordsController.updateEmergencyWords(body);
    }
    catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});

describe('deleteEmergencyWords', () => {
  it('Should successfully delete the words when the id is valid', async () => {
    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);
    let words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    let res = await emergencyWordsController.postEmergencyWords(words);
    
    await emergencyWordsController.deleteEmergencyWords(res.id);
    
    let empty = await emergencyRepository.findOneBy({id: res.id});

    expect(empty).toBeNull();

    expect(removeSpy).toBeCalled();
    expect(broadCastSpy).toBeCalled();
   
    words = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    res = await emergencyWordsController.postEmergencyWords(words);
    
    const body = {
      id: res.id,
      user_id: 'test_id',
      contact: 'all'
    };

    await emergencyWordsController.updateEmergencyWords(body);
    await emergencyWordsController.deleteEmergencyWords(res.id);
    
    empty = await emergencyRepository.findOneBy({id: res.id});

    expect(empty).toBeNull();
  });

  it('Should throw expection when no such message found', async () => {
    const user = userRepository.create();
    user.id = 'test_id';
    user.username = 'test_username';
    user.password = 'test_password';
    user.statusTimeStamp = new Date().getTime().toString();

    await userRepository.save(user);
    let words: PostEmergencyWordsInput = {
      user_id: 'test_id',
      contact: 'test_username',
      email: '',
      timeout: 0,
      content: '111',
    };

    await emergencyWordsController.postEmergencyWords(words);
    
    try {
      await emergencyWordsController.deleteEmergencyWords('x');
    }  
    catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  })
});

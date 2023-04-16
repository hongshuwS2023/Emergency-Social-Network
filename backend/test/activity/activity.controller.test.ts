import ActivityController from '../../src/activity/activtiy.controller';
import {ApiException, ErrorMessage} from '../../src/responses/api.exception';
import {Activity, ActivityStatus} from '../../src/activity/activity.entity';
import {User} from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';
import {describe} from 'node:test';

const activityController = new ActivityController();
const activityRepository = ESNDataSource.getRepository(Activity);
const userRepository = ESNDataSource.getRepository(User);

beforeEach(async () => {
  await ESNDataSource.initialize();
  const victim = userRepository.create();
  victim.id = 'victim_id';
  victim.username = 'victim_name';
  victim.password = 'victim_password';
  await userRepository.save(victim);
  const member = userRepository.create();
  member.id = 'member_id';
  member.username = 'member_name';
  member.password = 'member_password';
  await userRepository.save(member);
  const activity = activityRepository.create();
  activity.id = 'activity_id';
  activity.name = 'activity_name';
  activity.description = 'activity_description';
  activity.status = ActivityStatus.INCOMPLETED;
  activity.members = [victim];
  await activityRepository.save(activity);
  const activity2 = activityRepository.create();
  activity2.id = 'activity2_id';
  activity2.name = 'activity2_name';
  activity2.description = 'activity2_description';
  activity2.status = ActivityStatus.INCOMPLETED;
  activity2.members = [victim, member];
  await activityRepository.save(activity2);
});

afterEach(async () => {
  await ESNDataSource.destroy();
});

describe('createActivivty', () => {
  it('Should successfully create the activity by the victim himself', async () => {
    const createActivityInput = {
      id: 'victim_id',
      victimName: 'victim_name',
    };

    const res = await activityController.createActivity(createActivityInput);

    expect(res.id).not.toBeNull();
    expect(res.name).toBe('Rescue victim_name');
    expect(res.victim.username).toBe('victim_name');
    expect(res.description).toBe('victim_name is in danger, please help him!');
    expect(res.members[0].id).toBe('victim_id');
  });

  it('Should successfully create the activity by others', async () => {
    const createActivityInput = {
      id: 'member_id',
      name: 'activity_test_1',
      victimName: 'victim_name',
      description: 'activity_description',
    };

    const res = await activityController.createActivity(createActivityInput);

    expect(res.id).not.toBeNull();
    expect(res.name).toBe('activity_test_1');
    expect(res.victim.username).toBe('victim_name');
    expect(res.description).toBe('activity_description');
    expect(res.members[0].id).toBe('member_id');
  });
  it('Should return error message if the victim is not a user in the system', async () => {
    const invalidCreateActivityInput = {
      id: 'member_id',
      name: 'activity_test_1',
      victimName: 'invalid_victim_name',
      description: 'activity_description',
    };
    try {
      await activityController.createActivity(invalidCreateActivityInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });

  it('Should return error message if the victim is not a user in the system', async () => {
    const invalidCreateActivityInput = {
      id: 'invalid_member_id',
      name: 'activity_test_1',
      victimName: 'victim_name',
      description: 'activity_description',
    };
    try {
      await activityController.createActivity(invalidCreateActivityInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

describe('getActivivties', () => {
  it('Should return all activities in the databse', async () => {
    const res = await activityController.getActivities();

    expect(res.length).toEqual(2);
  });
});

describe('getActivivy', () => {
  it('Should return the correct activity based on the input id', async () => {
    const res = await activityController.getActivity('activity_id');

    expect(res.id).toEqual('activity_id');
  });

  it('Should return the error message if the input id is invalid', async () => {
    try {
      await activityController.getActivity('invalid_activity_id');
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGACTIVITYNAME
      );
    }
  });
});

describe('updateActivivty', () => {
  it('Should successfully update the activity based on the given info', async () => {
    const updateActivityInput = {
      id: 'activity_id',
      userId: 'member_id',
      name: 'updatedName',
      description: 'updatedDescription',
      status: ActivityStatus.COMPLETED,
    };

    await activityController.updateActivity(updateActivityInput);

    const res = await activityRepository.findOne({
      relations: ['members'],
      where: {
        id: updateActivityInput.id,
      },
    });
    expect(res!.id).not.toBeNull();
    expect(res!.name).toBe('updatedName');
    expect(res!.description).toBe('updatedDescription');
    expect(res!.members.length).toEqual(2);
    expect(res!.members[1].id).toBe('member_id');
    expect(res!.status).toBe(ActivityStatus.COMPLETED);
  });

  it('Should not update the activity member if the member is in the activity', async () => {
    const updateActivityInput = {
      id: 'activity2_id',
      userId: 'member_id',
      name: 'updatedName',
      description: 'updatedDescription',
      status: ActivityStatus.COMPLETED,
    };

    await activityController.updateActivity(updateActivityInput);

    const res = await activityRepository.findOne({
      relations: ['members'],
      where: {
        id: updateActivityInput.id,
      },
    });
    expect(res!.id).not.toBeNull();
    expect(res!.name).toBe('updatedName');
    expect(res!.description).toBe('updatedDescription');
    expect(res!.members.length).toEqual(2);
    expect(res!.members[1].id).toBe('member_id');
    expect(res!.status).toBe(ActivityStatus.COMPLETED);
  });

  it('Should only update the given info', async () => {
    const updateActivityInput = {
      id: 'activity_id',
      userId: 'member_id',
    };

    await activityController.updateActivity(updateActivityInput);

    const res = await activityRepository.findOne({
      relations: ['members'],
      where: {
        id: updateActivityInput.id,
      },
    });
    expect(res!.id).not.toBeNull();
    expect(res!.name).toBe('activity_name');
    expect(res!.description).toBe('activity_description');
    expect(res!.members.length).toEqual(2);
    expect(res!.members[1].id).toBe('member_id');
  });

  it('Should return error message if the activity is not found in the system', async () => {
    const invalidUpdateActivityInput = {
      id: 'invalid_activity_id',
      userId: 'member_id',
      name: 'updatedName',
      description: 'updatedDescription',
      status: ActivityStatus.COMPLETED,
    };
    try {
      await activityController.updateActivity(invalidUpdateActivityInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGACTIVITYNAME
      );
    }
  });

  it('Should return error message if the member is not a user in the system', async () => {
    const invalidUpdateActivityInput = {
      id: 'activity_id',
      userId: 'invalid_member_id',
      name: 'updatedName',
      description: 'updatedDescription',
      status: ActivityStatus.COMPLETED,
    };
    try {
      await activityController.updateActivity(invalidUpdateActivityInput);
    } catch (error) {
      expect((<ApiException>error).error_message).toBe(
        ErrorMessage.WRONGUSERNAME
      );
    }
  });
});

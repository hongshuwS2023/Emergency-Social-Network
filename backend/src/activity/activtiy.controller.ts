import {Repository} from 'typeorm';
import {NotFoundException, ErrorMessage} from '../responses/api.exception';
import ESNDataSource from '../utils/datasource';
import {Activity, ActivityStatus} from './activity.entity';
import {Body, Post, Get, Put, Route} from 'tsoa';
import {v4 as uuid} from 'uuid';
import {CreateActivityInput} from '../requests/createactivity.input';
import {UpdateActivityInput} from '../requests/updateActivity.input';
import {SocketServer} from '../utils/socketServer';
import {User} from '../user/user.entity';

@Route('/api/activities')
export default class ActivityController {
  socketServer: SocketServer;
  activityRepository: Repository<Activity>;
  userRepository: Repository<User>;

  constructor() {
    this.socketServer = SocketServer.getInstance();
    this.activityRepository = ESNDataSource.getRepository(Activity);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Get an activity based on activityId provided
   * @param activityId
   * @returns activity entity
   */
  @Get('{activityId}')
  async getActivity(activityId: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      relations: ['victim', 'members'],
      where: {
        id: activityId,
      },
    });

    if (activity === null) {
      throw new NotFoundException(ErrorMessage.WRONGACTIVITYNAME);
    }

    return activity;
  }

  /**
   * Get all activities
   * @returns activity entity
   */
  @Get()
  async getActivities(): Promise<Activity[]> {
    const activities = await this.activityRepository.find({
      relations: ['victim', 'members'],
      order: {
        status: 'ASC',
        name: 'ASC',
      },
    });

    return activities;
  }

  /**
   * Update the states of an activity based on the information provieded
   * @param updateActivityInput
   * @returns activity entity
   */
  @Put()
  async updateActivity(
    @Body() updateActivityInput: UpdateActivityInput
  ): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      relations: ['members'],
      where: {
        id: updateActivityInput.id,
      },
    });
    if (!activity) {
      throw new NotFoundException(ErrorMessage.WRONGACTIVITYNAME);
    }
    const user = await this.userRepository.findOneBy({
      id: updateActivityInput.userId,
    });
    if (!user) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    let duplicatedMember = 0;
    activity.members.forEach((member: User) => {
      if (member.id === user.id) {
        duplicatedMember = 1;
      }
    });
    if (!duplicatedMember) {
      activity.members.push(user);
    }
    activity.name = updateActivityInput.name
      ? updateActivityInput.name
      : activity.name;
    activity.description = updateActivityInput.description
      ? updateActivityInput.description
      : activity.description;
    activity.status = updateActivityInput.status
      ? updateActivityInput.status
      : activity.status;
    await this.activityRepository.save(activity);
    this.socketServer.broadcastActivityMembers(updateActivityInput.id);
    return activity;
  }

  /**
   * Create an activity in the system
   * @param createActivityInput
   * @returns activity
   */
  @Post()
  async createActivity(
    @Body() createActivityInput: CreateActivityInput
  ): Promise<Activity> {
    const {id, name, victimName, description} = createActivityInput;
    const victim = await this.userRepository.findOneBy({
      username: victimName,
    });
    const member = await this.userRepository.findOneBy({
      id: id,
    });
    if (!victim) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    if (!member) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }
    const activity = this.activityRepository.create();
    activity.id = uuid();
    activity.name = name ? name : `Rescue ${victim.username}`;
    activity.victim = victim;
    activity.description = description
      ? description
      : `${victim.username} is in danger, please help him!`;
    activity.status = ActivityStatus.INCOMPLETED;
    const members: User[] = [member];
    activity.members = members;
    await this.activityRepository.save(activity);
    this.socketServer.joinRoom(victim.id, victim.id);
    this.socketServer.broadcastActivity();
    this.socketServer.broadcastActivityToVictim(victim.id, activity);
    return activity;
  }
}

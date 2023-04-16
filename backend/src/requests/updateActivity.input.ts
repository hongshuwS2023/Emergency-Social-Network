import {ActivityStatus} from '../activity/activity.entity';

export interface UpdateActivityInput {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  status?: ActivityStatus;
}

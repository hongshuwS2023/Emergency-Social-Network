import {EmergencyWords} from '../emergency/emergency.entity';

export interface GetEmergencyWordsResponse {
  availables: EmergencyWords[];
  unsent: EmergencyWords | null;
}

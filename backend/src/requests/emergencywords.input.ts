export interface PostEmergencyWordsInput {
  user_id: string;
  contact: string;
  email: string;
  timeout: number;
  content: string;
}

export interface EmergencyWordsTransit {
  user_id: string;
  email?: string;
  emergency_id: string;
  content: string;
}

export interface UpdateEmergencyWordsInput {
  id: string;
  user_id: string;
  contact?: string;
  content?: string;
  email?: string;
  timeout?: number;
}

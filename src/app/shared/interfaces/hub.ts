import { Mmii } from './mmii';

export type HubType = 'fight' | 'trade';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';
export type RoomStatus = 'active' | 'completed' | 'abandoned';

export interface HubPlayer {
  id: string;
  name: string;
  mmii?: Mmii;
}

export interface HubInvitation {
  id: string;
  type: HubType;
  sender?: HubPlayer;
  receiver?: HubPlayer;
  status: InvitationStatus;
  expires_at: string;
  created_at?: string;
}

export interface HubRoom {
  id: string;
  type: HubType;
  status: RoomStatus;
  player_one: HubPlayer;
  player_two: HubPlayer;
  created_at?: string;
}

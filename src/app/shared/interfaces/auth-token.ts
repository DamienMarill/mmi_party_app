import {User} from './user';

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user?: User; // Optional for Moodle OAuth callback
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: User | null;
}

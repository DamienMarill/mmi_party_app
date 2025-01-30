import {Mmii} from './mmii';

export interface User {
  id: string;
  name: string;
  email: string;
  um_email: string;
  group: GroupUser;
  mmii: Mmii;
  created_at: string;
  updated_at: string;
}

export enum GroupUser {
  Student = 'student',
  Staff = 'staff',
  Mmi1 = 'mmi1',
  Mmi2 = 'mmi2',
  Mmi3 = 'mmi3',
  Misc = 'misc',
}

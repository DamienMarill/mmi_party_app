import {User} from './user';

export interface Lootbox {
  user: User;
  id: string;
  type: LootboxType;
}

export enum LootboxType {
  Quotidian = 'quotidian',
  Starter = 'starter',
  Purchased = 'purchased',
  Gifted = 'gifted',
  Misc = 'misc',
}

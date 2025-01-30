import {User} from './user';
import {CardInstance} from './card-instance';

export interface Lootbox {
  user: User;
  id: string;
  type: LootboxType;
  cards: CardInstance[];
}

export enum LootboxType {
  Quotidian = 'quotidian',
  Starter = 'starter',
  Purchased = 'purchased',
  Gifted = 'gifted',
  Misc = 'misc',
}

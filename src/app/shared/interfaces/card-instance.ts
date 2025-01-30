import {CardVersion} from './card-version';
import {Lootbox} from './lootbox';
import {User} from './user';

export interface CardInstance {
  id: string;
  card_version?: CardVersion;
  lootbox?: Lootbox;
  owner?: User;
  count?: number;
}

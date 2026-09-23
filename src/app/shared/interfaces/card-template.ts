import {CardVersion} from './card-version';
import {User, GroupUser} from './user';
import {Mmii} from './mmii';
import {CardStats} from './card-stats';

export interface CardTemplate {
  card_versions?: CardVersion[];
  base_user?: User;
  id: string;
  mmii?: Mmii;
  level: number;
  name: string;
  shape: boolean[][];
  stats: CardStats;
  type: CardType;
  is_lootable?: boolean;
  /** Promo réelle du propriétaire (null si carte fictive). Sert à afficher "Alumni". */
  owner_promo?: GroupUser | null;
}

export enum CardType {
  Student = 'student',
  Staff = 'staff',
  Objet = 'object',
}

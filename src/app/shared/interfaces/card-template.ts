import {CardVersion} from './card-version';
import {User} from './user';
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
}

export enum CardType {
  Student = 'student',
  Staff = 'staff',
  Objet = 'object',
}

import {CardTemplate} from './card-template';

export interface CardVersion {
  card_template?: CardTemplate;
  id: string;
  image: string;
  rarity: Rarity;
}

export enum Rarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

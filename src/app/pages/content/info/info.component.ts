import { Component } from '@angular/core';
import { faFaceDisguise } from '@fortawesome/pro-regular-svg-icons';
import {
  faGem,
  faCrown,
  faStar,
  faCircle,
  faDiamond,
  faGift,
  faDice,
  faUsers,
  faClock,
  faIdCard,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  fa = {
    faFaceDisguise,
    faGem,
    faCrown,
    faStar,
    faCircle,
    faDiamond,
    faGift,
    faDice,
    faUsers,
    faClock,
    faIdCard,
    faArrowLeft
  };

  rarities = ['Commune', 'Peu commune', 'Rare', 'Épique'];

  rarityColors: Record<string, string> = {
    'Commune': 'bg-rarity-common',
    'Peu commune': 'bg-rarity-uncommon',
    'Rare': 'bg-rarity-rare',
    'Épique': 'bg-rarity-epic',
  };

  dropSlots = [
    { slot: 1, common: '100%', uncommon: '0%', rare: '0%', epic: '0%' },
    { slot: 2, common: '75%', uncommon: '25%', rare: '0%', epic: '0%' },
    { slot: 3, common: '50%', uncommon: '40%', rare: '9%', epic: '1%' },
    { slot: 4, common: '30%', uncommon: '50%', rare: '17%', epic: '3%' },
    { slot: 5, common: '0%', uncommon: '35%', rare: '60%', epic: '5%' },
  ];
}

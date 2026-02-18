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

  dropSlots = [
    { slot: 1, rates: [{ type: 'Étudiant L1', pct: '100%' }] },
    { slot: 2, rates: [{ type: 'Étudiant L1', pct: '100%' }] },
    { slot: 3, rates: [{ type: 'Étudiant L2', pct: '70%' }, { type: 'Étudiant L3', pct: '25%' }, { type: 'Personnel', pct: '5%' }] },
    { slot: 4, rates: [{ type: 'Étudiant L2', pct: '60%' }, { type: 'Étudiant L3', pct: '35%' }, { type: 'Personnel', pct: '5%' }] },
    { slot: 5, rates: [{ type: 'Personnel', pct: '20%' }, { type: 'Objet', pct: '80%' }] },
  ];

  rarities = [
    { name: 'Commune', pct: '70%', color: 'badge-ghost', icon: this.fa.faCircle },
    { name: 'Peu commune', pct: '20%', color: 'badge-success', icon: this.fa.faDiamond },
    { name: 'Rare', pct: '8%', color: 'badge-info', icon: this.fa.faStar },
    { name: 'Épique', pct: '2%', color: 'badge-secondary', icon: this.fa.faGem },
    { name: 'Légendaire', pct: '0%', color: 'badge-warning', icon: this.fa.faCrown },
  ];
}

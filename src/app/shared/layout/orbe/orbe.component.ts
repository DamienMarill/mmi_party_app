import {Component, Input} from '@angular/core';
import {Rarity} from '../../interfaces/card-version';

@Component({
  selector: 'app-orbe',
  standalone: false,

  templateUrl: './orbe.component.html',
  styleUrl: './orbe.component.scss'
})
export class OrbeComponent {
  @Input()rarity?: Rarity;
  @Input()show: boolean = true;

  raretyTable = [
    'rare',
    'common',
    'uncommon',
    'epic',
  ]

  getRarityIndex(rarity: Rarity) {
    return this.raretyTable.indexOf(rarity)+1;
  }
}

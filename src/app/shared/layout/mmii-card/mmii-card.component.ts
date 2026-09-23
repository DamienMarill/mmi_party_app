import {Component, Input} from '@angular/core';
import {CardVersion} from '../../interfaces/card-version';
import {GroupUser} from '../../interfaces/user';
import {AssetsService} from '../../services/assets.service';
import { faFaceDisguise } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'app-mmii-card',
  standalone: false,

  templateUrl: './mmii-card.component.html',
  styleUrl: './mmii-card.component.scss'
})
export class MmiiCardComponent {
  @Input()cardVersion?: CardVersion;
  @Input()count?: number;

  fa = {
    faFaceDisguise,
  }

  constructor(
    public assetsService: AssetsService
  ) {
  }

  get typeLabel(): string {
    const tpl = this.cardVersion?.card_template;
    if (!tpl) return '';
    switch (tpl.type) {
      case 'student': return tpl.owner_promo === GroupUser.Alumni ? 'Alumni' : 'MMI' + tpl.level;
      case 'staff': return 'Prof';
      case 'object': return 'Objet';
      default: return '';
    }
  }
}

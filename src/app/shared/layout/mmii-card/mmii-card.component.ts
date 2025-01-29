import {Component, Input} from '@angular/core';
import {CardVersion} from '../../interfaces/card-version';
import {AssetsService} from '../../services/assets.service';

@Component({
  selector: 'app-mmii-card',
  standalone: false,

  templateUrl: './mmii-card.component.html',
  styleUrl: './mmii-card.component.scss'
})
export class MmiiCardComponent {
  @Input()cardVersion?: CardVersion;

  constructor(
    public assetsService: AssetsService
  ) {
  }
}

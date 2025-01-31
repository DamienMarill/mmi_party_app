import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ApiService } from '../../services/api.service';
import {AssetsService} from '../../services/assets.service';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-bg',
  standalone: false,

  templateUrl: './edit-bg.component.html',
  styleUrl: './edit-bg.component.scss'
})
export class EditBgComponent {
    @Input()background?: string;
    @Output()backgroundChange: EventEmitter<string> = new EventEmitter<string>();
    bgName: string = '';

    backgrounds: string[] = [];

    fa= {
      faCheck
    }

    constructor(
      public apiService: ApiService,
      public assetsService: AssetsService
    ) {
      this.apiService.request<string[]>('GET', '/mmii/parts/backgrounds').subscribe(backgrounds => {
        console.log(backgrounds);
        this.backgrounds = backgrounds;
        this.changeBg(this.backgrounds[0]);
      });
    }

    changeBg(bgName: string) {
      this.bgName = bgName;
      this.backgroundChange.emit(bgName);
    }
}

import { Component } from '@angular/core';
import {MmiiShape} from '../../../shared/interfaces/mmii-shape';
import {ClipboardService} from '../../../shared/services/clipboard.service';

@Component({
  selector: 'app-generate-cards',
  standalone: false,

  templateUrl: './generate-cards.component.html',
  styleUrl: './generate-cards.component.scss'
})
export class GenerateCardsComponent {

  name: string = '';
  shapes?: MmiiShape;
  background: string = '';

  constructor(
    private clipboardService: ClipboardService
  ) {
  }


  generate(){
    const perso = {
      name: this.name,
      shapes: this.shapes,
      background: this.background
    };

    const json = JSON.stringify(perso);

    console.log(json);
    this.clipboardService.copyToClipboard(json);
  }
}

import { Directive, HostListener, Input } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Directive({
  selector: '[appSound]',
  standalone: false
})
export class SoundDirective {
  @Input('appSound') type: 'click' | 'card' | 'all' = 'all';

  constructor(private soundService: SoundService) {}

  @HostListener('click') onClick() {
    if (this.type === 'click' || this.type === 'all' || this.type === 'card') {
      this.soundService.click();
    }
  }
}

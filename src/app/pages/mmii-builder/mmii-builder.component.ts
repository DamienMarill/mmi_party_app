import { Component } from '@angular/core';
import { MmiiShape } from '../../shared/interfaces/mmii-shape';
import { ClipboardService } from '../../shared/services/clipboard.service';
import { AssetsService } from '../../shared/services/assets.service';

@Component({
  selector: 'app-mmii-builder',
  standalone: false,
  templateUrl: './mmii-builder.component.html',
  styleUrl: './mmii-builder.component.scss'
})
export class MmiiBuilderComponent {
  name: string = '';
  shapes?: MmiiShape;
  background: string = '';
  copied: boolean = false;

  constructor(
    private clipboardService: ClipboardService,
    public assetsService: AssetsService
  ) {}

  getJson(): string {
    const mmii = {
      name: this.name,
      shapes: this.shapes,
      background: this.background
    };
    return JSON.stringify(mmii);
  }

  async copyJson() {
    const success = await this.clipboardService.copyToClipboard(this.getJson());
    if (success) {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }
  }
}

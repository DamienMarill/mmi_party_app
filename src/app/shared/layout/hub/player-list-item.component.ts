import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { HubPlayer } from '../../interfaces/hub';
import { AssetsService } from '../../services/assets.service';

@Component({
  selector: 'app-player-list-item',
  standalone: false,
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.scss'],
})
export class PlayerListItemComponent {
  assetsService = inject(AssetsService);

  @Input() player!: HubPlayer;
  @Input() canInvite = true;
  @Output() invite = new EventEmitter<void>();

  onInvite(): void {
    if (this.canInvite) {
      this.invite.emit();
    }
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { HubInvitation } from '../../interfaces/hub';

@Component({
  selector: 'app-invitation-card',
  standalone: false,
  templateUrl: './invitation-card.component.html',
  styleUrls: ['./invitation-card.component.scss'],
})
export class InvitationCardComponent implements OnInit, OnDestroy {
  @Input() invitation!: HubInvitation;
  @Output() accept = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();

  remainingTime = 60;
  private intervalId: any;

  ngOnInit(): void {
    this.updateRemainingTime();
    this.intervalId = setInterval(() => this.updateRemainingTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateRemainingTime(): void {
    const expires = new Date(this.invitation.expires_at).getTime();
    const now = Date.now();
    this.remainingTime = Math.max(0, Math.floor((expires - now) / 1000));
  }

  onAccept(): void {
    this.accept.emit();
  }

  onDecline(): void {
    this.decline.emit();
  }

  getHubTypeLabel(): string {
    return this.invitation.type === 'fight' ? '⚔️ Combat' : '🔄 Échange';
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HubService } from '../../services/hub.service';
import { ApiService } from '../../services/api.service';
import { HubPlayer, HubInvitation, HubRoom, HubType } from '../../interfaces/hub';

@Component({
  selector: 'app-hub',
  standalone: false,
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
})
export class HubComponent implements OnInit, OnDestroy {
  @Input() hubType!: HubType;
  @Input() currentUserId!: string;
  @Output() roomCreated = new EventEmitter<HubRoom>();

  private hubService = inject(HubService);
  private apiService = inject(ApiService);
  private destroy$ = new Subject<void>();

  onlinePlayers: HubPlayer[] = [];
  receivedInvitations: HubInvitation[] = [];
  sentInvitation: HubInvitation | null = null;
  currentRoom: HubRoom | null = null;
  isLoading = false;
  error: string | null = null;

  tradesUsed = 0;
  tradesLimit = 5;

  sentInvitationRemaining = 0;
  private timerInterval: any = null;

  ngOnInit(): void {
    // Rejoindre le hub
    this.hubService.joinHub(this.hubType);

    // S'abonner aux observables
    this.hubService.onlinePlayers$
      .pipe(takeUntil(this.destroy$))
      .subscribe((players) => {
        // Filtrer le joueur actuel
        this.onlinePlayers = players.filter((p) => p.id !== this.currentUserId);
      });

    this.hubService.receivedInvitations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invitations) => {
        this.receivedInvitations = invitations;
      });

    this.hubService.sentInvitation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invitation) => {
        this.sentInvitation = invitation;
        this.clearTimer();
        if (invitation) {
          this.updateSentTimer();
          this.timerInterval = setInterval(() => this.updateSentTimer(), 1000);
        }
      });

    this.hubService.currentRoom$
      .pipe(takeUntil(this.destroy$))
      .subscribe((room) => {
        this.currentRoom = room;
        if (room) {
          this.roomCreated.emit(room);
        }
      });

    // Écouter les nouvelles invitations pour les notifications visuelles
    this.hubService.invitationReceived$
      .pipe(takeUntil(this.destroy$))
      .subscribe((invitation) => {
        console.log('New invitation received:', invitation);
      });

    // Charger le compteur d'échanges si hub de type trade
    if (this.hubType === 'trade') {
      this.loadDailyCount();
    }
  }

  loadDailyCount(): void {
    this.apiService.request<{ used: number, limit: number }>('get', '/trade/daily-count')
      .subscribe({
        next: (res) => {
          this.tradesUsed = res.used;
          this.tradesLimit = res.limit;
        }
      });
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.hubService.leaveHub();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateSentTimer(): void {
    if (this.sentInvitation) {
      this.sentInvitationRemaining = this.getRemainingTime(this.sentInvitation.expires_at);
      if (this.sentInvitationRemaining <= 0) {
        this.clearTimer();
      }
    }
  }

  /**
   * Envoie une invitation à un joueur
   */
  invitePlayer(player: HubPlayer): void {
    if (this.sentInvitation || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.hubService.sendInvitation(player.id).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Erreur lors de l\'envoi de l\'invitation';
      },
    });
  }

  /**
   * Accepte une invitation
   */
  acceptInvitation(invitation: HubInvitation): void {
    this.isLoading = true;
    this.error = null;

    this.hubService.acceptInvitation(invitation.id).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Erreur lors de l\'acceptation';
      },
    });
  }

  /**
   * Refuse une invitation
   */
  declineInvitation(invitation: HubInvitation): void {
    this.hubService.declineInvitation(invitation.id).subscribe({
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors du refus';
      },
    });
  }

  /**
   * Annule l'invitation envoyée
   */
  cancelSentInvitation(): void {
    if (!this.sentInvitation) return;

    this.hubService.cancelInvitation(this.sentInvitation.id).subscribe({
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de l\'annulation';
      },
    });
  }

  /**
   * Calcule le temps restant pour une invitation
   */
  getRemainingTime(expiresAt: string): number {
    const expires = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expires - now) / 1000));
  }
}

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeService, TradeState } from '../../../../shared/services/trade.service';
import { HubService } from '../../../../shared/services/hub.service';
import { ConfettiService } from '../../../../shared/services/confetti.service';
import { HubRoom } from '../../../../shared/interfaces/hub';
import { ApiService } from '../../../../shared/services/api.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-trade-room',
  standalone: false,
  templateUrl: './trade-room.component.html',
  styleUrl: './trade-room.component.scss'
})
export class TradeRoomComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tradeService = inject(TradeService);
  private hubService = inject(HubService);
  private apiService = inject(ApiService);
  private confettiService = inject(ConfettiService);
  private modalService = inject(ModalService);
  private destroy$ = new Subject<void>();

  roomId!: string;
  room!: HubRoom;
  tradeState: TradeState | null = null;
  currentUserId!: string;

  isPlayerOne = false;
  opponentName = '';

  isLoading = true;
  showCancelModal = false;

  tradesUsed = 0;
  tradesLimit = 5;

  ngOnInit(): void {
    this.apiService.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => !!user)
    ).subscribe(user => {
      this.currentUserId = user!.id;
      
      this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
        const id = params.get('roomId');
        if (id) {
          this.roomId = id;
          this.loadRoom();
        } else {
          this.router.navigate(['/trade']);
        }
      });
    });

    this.tradeService.tradeState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.tradeState = state;
    });

    this.tradeService.tradeCompleted$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.confettiService.fireworks();
      this.loadDailyCount();
    });

    this.tradeService.tradeCancelled$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.tradeService.disconnectFromRoom();
      this.router.navigate(['/trade'], { queryParams: { cancelled: true } });
    });

    this.tradeService.opponentLeft$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.tradeService.cancelTrade(this.roomId).subscribe(() => {
        this.tradeService.disconnectFromRoom();
        this.router.navigate(['/trade'], { queryParams: { cancelled: true } });
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Ne pas déconnecter ici : la navigation vers /cartes détruirait le WS.
    // La déconnexion se fait au cancelTrade ou quand on quitte /trade complètement.
  }

  loadRoom(): void {
    this.hubService.getRoom(this.roomId).subscribe({
      next: (res) => {
        this.room = res.room;
        this.isPlayerOne = this.currentUserId === this.room.player_one.id;
        this.opponentName = this.isPlayerOne ? this.room.player_two.name : this.room.player_one.name;

        // Utiliser le trade_state hydraté retourné par l'API
        const initialState: TradeState = (res.room as any).trade_state || {
          player_one_card_id: null,
          player_two_card_id: null,
          player_one_validated: false,
          player_two_validated: false,
          player_one_accepted: false,
          player_two_accepted: false,
        };

        this.tradeService.connectToRoom(this.roomId, initialState);
        this.loadDailyCount();
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/trade']);
      }
    });
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

  get myCard(): any {
    if (!this.tradeState) return null;
    return this.isPlayerOne ? this.tradeState.player_one_card : this.tradeState.player_two_card;
  }

  get opponentCard(): any {
    if (!this.tradeState) return null;
    return this.isPlayerOne ? this.tradeState.player_two_card : this.tradeState.player_one_card;
  }

  get myValidated(): boolean {
    if (!this.tradeState) return false;
    return this.isPlayerOne ? this.tradeState.player_one_validated : this.tradeState.player_two_validated;
  }

  get opponentValidated(): boolean {
    if (!this.tradeState) return false;
    return this.isPlayerOne ? this.tradeState.player_two_validated : this.tradeState.player_one_validated;
  }

  get bothValidated(): boolean {
    return this.myValidated && this.opponentValidated;
  }

  get myAccepted(): boolean {
    if (!this.tradeState) return false;
    return this.isPlayerOne ? this.tradeState.player_one_accepted : this.tradeState.player_two_accepted;
  }

  get opponentAccepted(): boolean {
    if (!this.tradeState) return false;
    return this.isPlayerOne ? this.tradeState.player_two_accepted : this.tradeState.player_one_accepted;
  }

  goToCollection(): void {
    if (!this.myValidated) {
      this.router.navigate([`/trade/${this.roomId}/cartes`]);
    }
  }

  validateChoice(): void {
    if (this.myCard && !this.myValidated) {
      this.tradeService.validateSelection(this.roomId).subscribe({
        next: () => {},
        error: (err) => this.modalService.alert(err.error.error || "Erreur de validation", 'Erreur')
      });
    }
  }

  unvalidateChoice(): void {
    if (this.myValidated) {
      this.tradeService.unvalidateSelection(this.roomId).subscribe({
        next: () => {},
        error: (err) => this.modalService.alert(err.error.error || "Erreur de déverrouillage", 'Erreur')
      });
    }
  }

  acceptTrade(): void {
    if (this.bothValidated && !this.myAccepted) {
      this.tradeService.acceptTrade(this.roomId).subscribe({
        next: (response: any) => {
          if (response.state && !response.state.player_one_card_id) {
            this.confettiService.fireworks();
            this.loadDailyCount();
          }
        },
        error: (err) => this.modalService.alert(err.error.error || "Erreur d'acceptation", 'Erreur')
      });
    }
  }

  async cancelTrade(): Promise<void> {
    const confirmed = await this.modalService.confirm('Êtes-vous sûr de vouloir annuler l\'échange ?');
    if (confirmed) {
      this.tradeService.cancelTrade(this.roomId).subscribe({
        next: () => {
          this.tradeService.disconnectFromRoom();
          this.router.navigate(['/trade']);
        },
        error: (err) => this.modalService.alert(err.error.error || "Erreur d'annulation", 'Erreur')
      });
    }
  }
}

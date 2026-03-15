import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeService, TradeState } from '../../../../shared/services/trade.service';
import { HubService } from '../../../../shared/services/hub.service';
import { HubRoom } from '../../../../shared/interfaces/hub';
import { ApiService } from '../../../../shared/services/api.service';
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
  private destroy$ = new Subject<void>();

  roomId!: string;
  room!: HubRoom;
  tradeState: TradeState | null = null;
  currentUserId!: string;

  isPlayerOne = false;
  opponentName = '';
  
  isLoading = true;
  showCancelModal = false;

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
          this.router.navigate(['/content/trade']);
        }
      });
    });

    this.tradeService.tradeState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.tradeState = state;
    });

    this.tradeService.tradeCompleted$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.router.navigate(['/content/trade'], { queryParams: { success: true } });
    });

    this.tradeService.tradeCancelled$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.router.navigate(['/content/trade'], { queryParams: { cancelled: true } });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tradeService.disconnectFromRoom();
  }

  loadRoom(): void {
    this.hubService.getRoom(this.roomId).subscribe({
      next: (res) => {
        this.room = res.room;
        this.isPlayerOne = this.currentUserId === this.room.player_one.id;
        this.opponentName = this.isPlayerOne ? this.room.player_two.name : this.room.player_one.name;

        // Initialize state mapping
        const initialState: TradeState = this.room.metadata || {
          player_one_card_id: null,
          player_two_card_id: null,
          player_one_validated: false,
          player_two_validated: false,
          player_one_accepted: false,
          player_two_accepted: false,
        };

        this.tradeService.connectToRoom(this.roomId, initialState);
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/content/trade']);
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
      this.router.navigate([`/content/trade/${this.roomId}/cartes`]);
    }
  }

  validateChoice(): void {
    if (this.myCard && !this.myValidated) {
      this.tradeService.validateSelection(this.roomId).subscribe({
        next: () => {},
        error: (err) => alert(err.error.error || "Erreur de validation")
      });
    }
  }

  acceptTrade(): void {
    if (this.bothValidated && !this.myAccepted) {
      this.tradeService.acceptTrade(this.roomId).subscribe({
        next: () => {},
        error: (err) => alert(err.error.error || "Erreur d'acceptation")
      });
    }
  }

  cancelTrade(): void {
    if(confirm('Êtes-vous sûr de vouloir annuler l\'échange ?')) {
      this.tradeService.cancelTrade(this.roomId).subscribe({
        next: () => {
          this.router.navigate(['/content/trade']);
        },
        error: (err) => alert(err.error.error || "Erreur d'annulation")
      });
    }
  }
}

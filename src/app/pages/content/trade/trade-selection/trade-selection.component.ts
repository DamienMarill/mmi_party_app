import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { CardInstance } from '../../../../shared/interfaces/card-instance';
import { TradeService, TradeState } from '../../../../shared/services/trade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-trade-selection',
  standalone: false,
  templateUrl: './trade-selection.component.html',
  styleUrl: './trade-selection.component.scss'
})
export class TradeSelectionComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private tradeService = inject(TradeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private destroy$ = new Subject<void>();

  cards: CardInstance[] = [];
  roomId!: string;
  requiredRarity: string | null = null;
  currentUserId!: string;

  ngOnInit(): void {
    this.apiService.user$.pipe(
      takeUntil(this.destroy$),
      filter(u => !!u)
    ).subscribe(u => {
      this.currentUserId = u!.id;
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('roomId');
      if (id) {
        this.roomId = id;
        this.loadCollection();
      } else {
        this.router.navigate(['/trade']);
      }
    });

    this.tradeService.tradeState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state) {
        this.determineRequiredRarity(state);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCollection(): void {
    // Note : /collection API existante retourne des "CardInstance" uniques avec "count" groupées
    this.apiService.request<CardInstance[]>('GET', '/collection')
      .subscribe((response) => {
        this.cards = response;
      });
  }

  determineRequiredRarity(state: TradeState): void {
    // We need to know if we are player one or two. But we don't have HubRoom here directly.
    // However, if we look at state.player_one_card or player_two_card, we can deduce it from user_id?
    // Actually, we don't know who we are just from state unless one of the cards is populated and matches our ID.
    // Better: We just check both opponent fields. If one is validated, get its rarity.
    // Since we know we are NOT the one who validated (because we are on this selection page),
    // the validated one is the opponent.
    if (state.player_one_validated && state.player_one_card) {
      if (state.player_one_card.user_id !== this.currentUserId) {
        this.requiredRarity = state.player_one_card.card_version?.rarity;
      }
    } else if (state.player_two_validated && state.player_two_card) {
      if (state.player_two_card.user_id !== this.currentUserId) {
        this.requiredRarity = state.player_two_card.card_version?.rarity;
      }
    } else {
      this.requiredRarity = null;
    }
  }

  canSelect(card: CardInstance): boolean {
    if (!this.requiredRarity) return true;
    return card.card_version?.rarity === this.requiredRarity;
  }

  selectCardForTrade(card: CardInstance): void {
    if (!this.canSelect(card)) {
      this.modalService.alert(
        `Vous devez sélectionner une carte de rareté ${this.requiredRarity} pour cet échange.`,
        'Rareté incompatible'
      );
      return;
    }

    this.tradeService.selectCardByVersion(this.roomId, card.card_version!.id).subscribe({
      next: () => {
        this.router.navigate([`/trade/${this.roomId}`]);
      },
      error: (err) => this.modalService.alert(err.error?.error || 'Erreur lors de la sélection', 'Erreur')
    });
  }
}

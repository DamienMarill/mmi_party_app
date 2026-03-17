import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Subject} from 'rxjs';
import {CardVersion} from '../interfaces/card-version';

export interface UnlockedCard {
  card_version: CardVersion;
  source: string; // 'promo' | future event types
}

@Injectable({
  providedIn: 'root'
})
export class EventCheckService {
  private _unlockedCards = new Subject<UnlockedCard[]>();
  public unlockedCards$ = this._unlockedCards.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Run all event checks. Called after authentication is confirmed.
   */
  checkAll(): void {
    this.checkPromos();
  }

  private checkPromos(): void {
    this.apiService.request<{ unlocked: any[]; count: number }>('GET', '/me/promos/check')
      .subscribe({
        next: (response) => {
          if (response.count > 0) {
            const cards: UnlockedCard[] = response.unlocked.map(promo => ({
              card_version: promo.card_version,
              source: 'promo',
            }));
            this._unlockedCards.next(cards);
          }
        },
        error: () => {
          // Silent fail - promos are not critical
        },
      });
  }
}

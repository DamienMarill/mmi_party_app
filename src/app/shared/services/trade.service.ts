import { Injectable, inject, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, tap, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { EchoService } from './echo.service';

export interface TradeState {
  player_one_card_id: string | null;
  player_two_card_id: string | null;
  player_one_card?: any; // To be properly typed with CardInstance
  player_two_card?: any;
  player_one_validated: boolean;
  player_two_validated: boolean;
  player_one_accepted: boolean;
  player_two_accepted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private apiService = inject(ApiService);
  private echoService = inject(EchoService);
  private ngZone = inject(NgZone);

  private _tradeState = new BehaviorSubject<TradeState | null>(null);
  public tradeState$ = this._tradeState.asObservable();
  
  private _tradeCompleted = new Subject<void>();
  public tradeCompleted$ = this._tradeCompleted.asObservable();

  private _tradeCancelled = new Subject<void>();
  public tradeCancelled$ = this._tradeCancelled.asObservable();

  private currentRoomId: string | null = null;

  private _opponentLeft = new Subject<void>();
  public opponentLeft$ = this._opponentLeft.asObservable();

  connectToRoom(roomId: string, initialState: TradeState): void {
    // Toujours mettre à jour le state (peut avoir changé entre-temps)
    this._tradeState.next(initialState);

    // Mais ne pas re-souscrire au channel WS si déjà connecté à cette room
    if (this.currentRoomId === roomId) return;

    this.currentRoomId = roomId;

    // Utiliser un presence channel pour détecter les déconnexions
    const channel = this.echoService.presenceChannel(`hub-room.${roomId}`);
    if (channel) {
      channel
        .here(() => {})
        .joining(() => {})
        .leaving(() => {
          this.ngZone.run(() => {
            this._opponentLeft.next();
          });
        })
        .listen('.trade.state.updated', (data: { roomId: string, tradeState: TradeState }) => {
          this.ngZone.run(() => {
            this._tradeState.next(data.tradeState);
          });
        })
        .listen('.trade.completed', (data: { resetState?: TradeState }) => {
          this.ngZone.run(() => {
            if (data.resetState) {
              this._tradeState.next(data.resetState);
            }
            this._tradeCompleted.next();
          });
        })
        .listen('.trade.cancelled', () => {
          this.ngZone.run(() => {
            this._tradeCancelled.next();
          });
        });
    }
  }

  disconnectFromRoom(): void {
    // Note: We don't always want to disconnect the echo channel if we are just navigating
    // to the sub-route /trade/:roomId/cartes, so this will be called defensively.
    if (this.currentRoomId) {
      this.echoService.leaveChannel(`hub-room.${this.currentRoomId}`);
      this.currentRoomId = null;
      this._tradeState.next(null);
    }
  }

  selectCard(roomId: string, cardInstanceId: string): Observable<{ message: string, state: TradeState }> {
    return this.apiService.request('post', `/trade/${roomId}/select-card`, { card_instance_id: cardInstanceId }).pipe(
      tap((response: any) => {
        this._tradeState.next(response.state);
      })
    );
  }

  selectCardByVersion(roomId: string, cardVersionId: string): Observable<{ message: string, state: TradeState }> {
    return this.apiService.request('post', `/trade/${roomId}/select-card`, { card_version_id: cardVersionId }).pipe(
      tap((response: any) => {
        this._tradeState.next(response.state);
      })
    );
  }

  validateSelection(roomId: string): Observable<{ message: string, state: TradeState }> {
    return this.apiService.request('post', `/trade/${roomId}/validate`, {}).pipe(
      tap((response: any) => {
        this._tradeState.next(response.state);
      })
    );
  }

  unvalidateSelection(roomId: string): Observable<{ message: string, state: TradeState }> {
    return this.apiService.request('post', `/trade/${roomId}/unvalidate`, {}).pipe(
      tap((response: any) => {
        this._tradeState.next(response.state);
      })
    );
  }

  acceptTrade(roomId: string): Observable<{ message: string, state?: TradeState }> {
    return this.apiService.request('post', `/trade/${roomId}/accept`, {}).pipe(
      tap((response: any) => {
        if (response.state) {
          this._tradeState.next(response.state);
        }
      })
    );
  }

  cancelTrade(roomId: string): Observable<any> {
    return this.apiService.request('post', `/trade/${roomId}/cancel`, {});
  }
}


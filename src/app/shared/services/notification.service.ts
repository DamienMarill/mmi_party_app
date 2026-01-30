import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _isSubscribed = new BehaviorSubject<boolean>(false);
  public isSubscribed$ = this._isSubscribed.asObservable();
  
  constructor(
    private apiService: ApiService,
    private swPush: SwPush,
  ) {
    this.checkSubscriptionStatus();
  }
  
  get isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }
  
  get permission(): NotificationPermission {
    return Notification.permission;
  }
  
  async checkSubscriptionStatus(): Promise<void> {
    if (!this.isSupported) {
      this._isSubscribed.next(false);
      return;
    }

    try {
      const { subscribed } = await firstValueFrom(
        this.apiService.request<{ subscribed: boolean }>('get', '/push/status')
      );
      this._isSubscribed.next(subscribed);
    } catch {
      // Si on ne peut pas vérifier, on check au moins si le SW a une souscription
      try {
        const sub = await this.swPush.subscription.toPromise();
        this._isSubscribed.next(!!sub);
      } catch {
        this._isSubscribed.next(false);
      }
    }
  }
  
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications non supportées');
      return false;
    }
    
    // Si déjà accordé/refusé
    if (Notification.permission !== 'default') {
      return Notification.permission === 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  async subscribe(): Promise<boolean> {
    console.log('[NotificationService] Subscribe called');
    if (!this.swPush.isEnabled) {
      console.warn('[NotificationService] SwPush not enabled! Are you in dev mode?');
      // On continue quand même pour voir si ça passe, mais c'est suspect
    }

    try {
      if (this.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) {
            console.log('[NotificationService] Permission denied');
            return false;
        }
      }
      
      console.log('[NotificationService] Fetching VAPID key...');
      const { publicKey } = await firstValueFrom(
        this.apiService.request<{ publicKey: string }>('get', '/push/vapid-key')
      );
      console.log('[NotificationService] VAPID key received', publicKey);
      
      console.log('[NotificationService] Requesting subscription from SW...');
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: publicKey,
      });
      console.log('[NotificationService] Subscription received from SW', subscription);
      
      console.log('[NotificationService] Sending subscription to backend...');
      await firstValueFrom(
        this.apiService.request('post', '/push/subscribe', subscription.toJSON())
      );
      console.log('[NotificationService] Backend confirmed subscription.');
      
      this._isSubscribed.next(true);
      return true;
    } catch (error) {
      console.error('[NotificationService] Erreur subscription push:', error);
      return false;
    }
  }
  
  async unsubscribe(): Promise<boolean> {
    try {
      const subscription = await this.swPush.subscription.toPromise();
      
      if (subscription) {
        // Désabonnement côté serveur
        try {
            await firstValueFrom(
                this.apiService.request('post', '/push/unsubscribe', {
                    endpoint: subscription.endpoint,
                })
            );
        } catch (e) {
            console.warn('Erreur unsubscribe API:', e);
            // On continue quand même le désabonnement local
        }
        
        // Désabonnement local
        await subscription.unsubscribe();
      }
      
      this._isSubscribed.next(false);
      return true;
    } catch (error) {
      console.error('Erreur unsubscribe:', error);
      return false;
    }
  }
}

import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Echo, { Channel, PresenceChannel } from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

// Make Pusher globally available for Laravel Echo
(window as any).Pusher = Pusher;

export interface PresenceMember {
  id: string;
  name: string;
  mmii?: any;
}

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  private apiService = inject(ApiService);
  private ngZone = inject(NgZone);

  private echo: Echo<'reverb'> | null = null;
  private _isConnected = new BehaviorSubject<boolean>(false);

  public get isConnected$(): Observable<boolean> {
    return this._isConnected.asObservable();
  }

  /**
   * Initialise la connexion Echo avec le token JWT
   */
  connect(token: string): void {
    if (this.echo) {
      console.warn('[EchoService] Already connected');
      return;
    }

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.key,
      wsHost: environment.reverb.host,
      wsPort: environment.reverb.port,
      wssPort: environment.reverb.port,
      forceTLS: environment.reverb.scheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.back}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Écouter les événements de connexion
    this.echo.connector.pusher.connection.bind('connected', () => {
      this.ngZone.run(() => {
        console.log('[EchoService] Connected to Reverb');
        this._isConnected.next(true);
      });
    });

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      this.ngZone.run(() => {
        console.log('[EchoService] Disconnected from Reverb');
        this._isConnected.next(false);
      });
    });

    this.echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('[EchoService] Connection error:', error);
    });
  }

  /**
   * Ferme la connexion Echo
   */
  disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this._isConnected.next(false);
      console.log('[EchoService] Disconnected');
    }
  }

  /**
   * S'abonne à un canal privé
   */
  privateChannel(channelName: string): Channel | null {
    if (!this.echo) {
      console.error('[EchoService] Not connected');
      return null;
    }
    return this.echo.private(channelName);
  }

  /**
   * S'abonne à un canal de présence
   */
  presenceChannel(channelName: string): PresenceChannel | null {
    if (!this.echo) {
      console.error('[EchoService] Not connected');
      return null;
    }
    return this.echo.join(channelName);
  }

  /**
   * Quitte un canal
   */
  leaveChannel(channelName: string): void {
    if (this.echo) {
      this.echo.leave(channelName);
    }
  }

  /**
   * Retourne l'instance Echo (pour les cas avancés)
   */
  getEcho(): Echo<'reverb'> | null {
    return this.echo;
  }
}

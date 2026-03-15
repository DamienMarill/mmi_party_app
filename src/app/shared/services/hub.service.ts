import { Injectable, inject, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  tap,
} from 'rxjs';
import { ApiService } from './api.service';
import { EchoService, PresenceMember } from './echo.service';
import {
  HubInvitation,
  HubPlayer,
  HubRoom,
  HubType,
} from '../interfaces/hub';

@Injectable({
  providedIn: 'root',
})
export class HubService {
  private apiService = inject(ApiService);
  private echoService = inject(EchoService);
  private ngZone = inject(NgZone);

  // State
  private _currentHubType: HubType | null = null;
  private _onlinePlayers = new BehaviorSubject<HubPlayer[]>([]);
  private _receivedInvitations = new BehaviorSubject<HubInvitation[]>([]);
  private _sentInvitation = new BehaviorSubject<HubInvitation | null>(null);
  private _currentRoom = new BehaviorSubject<HubRoom | null>(null);

  // Events
  private _invitationReceived = new Subject<HubInvitation>();
  private _invitationResponse = new Subject<{
    invitation_id: string;
    status: string;
    room_id?: string;
  }>();
  private _invitationCancelled = new Subject<string>();
  private _roomCreated = new Subject<HubRoom>();

  // Public observables
  public onlinePlayers$ = this._onlinePlayers.asObservable();
  public receivedInvitations$ = this._receivedInvitations.asObservable();
  public sentInvitation$ = this._sentInvitation.asObservable();
  public currentRoom$ = this._currentRoom.asObservable();
  public invitationReceived$ = this._invitationReceived.asObservable();
  public invitationResponse$ = this._invitationResponse.asObservable();
  public invitationCancelled$ = this._invitationCancelled.asObservable();
  public roomCreated$ = this._roomCreated.asObservable();

  /**
   * Rejoint un hub et s'abonne aux canaux WebSocket
   */
  joinHub(type: HubType): void {
    this._currentHubType = type;

    // S'abonner au canal de présence pour les joueurs en ligne
    const presenceChannel = this.echoService.presenceChannel(`hub.${type}`);
    if (presenceChannel) {
      presenceChannel
        .here((members: PresenceMember[]) => {
          this.ngZone.run(() => {
            this._onlinePlayers.next(
              members.map((m) => ({
                id: m.id,
                name: m.name,
                mmii: m.mmii,
              }))
            );
          });
        })
        .joining((member: PresenceMember) => {
          this.ngZone.run(() => {
            const current = this._onlinePlayers.value;
            if (!current.find((p) => p.id === member.id)) {
              this._onlinePlayers.next([
                ...current,
                { id: member.id, name: member.name, mmii: member.mmii },
              ]);
            }
          });
        })
        .leaving((member: PresenceMember) => {
          this.ngZone.run(() => {
            this._onlinePlayers.next(
              this._onlinePlayers.value.filter((p) => p.id !== member.id)
            );
          });
        });
    }

    // Charger les invitations reçues existantes
    this.loadReceivedInvitations(type);
    this.loadSentInvitation(type);
  }

  /**
   * Quitte le hub actuel
   */
  leaveHub(): void {
    if (this._currentHubType) {
      this.echoService.leaveChannel(`hub.${this._currentHubType}`);
      this._currentHubType = null;
      this._onlinePlayers.next([]);
      this._receivedInvitations.next([]);
      this._sentInvitation.next(null);
      this._currentRoom.next(null);
    }
  }

  /**
   * S'abonne au canal privé de l'utilisateur pour recevoir les invitations
   */
  subscribeToUserChannel(userId: string): void {
    const channel = this.echoService.privateChannel(`user.${userId}`);
    if (channel) {
      channel
        .listen('.invitation.received', (data: { invitation: HubInvitation }) => {
          this.ngZone.run(() => {
            this._invitationReceived.next(data.invitation);
            // Ajouter à la liste des invitations reçues
            const current = this._receivedInvitations.value;
            this._receivedInvitations.next([data.invitation, ...current]);
          });
        })
        .listen('.invitation.response', (data: any) => {
          this.ngZone.run(() => {
            this._invitationResponse.next(data);
            // Clear sent invitation si c'est une réponse à la notre
            const sent = this._sentInvitation.value;
            if (sent && sent.id === data.invitation_id) {
              this._sentInvitation.next(null);
            }
          });
        })
        .listen('.invitation.cancelled', (data: { invitation_id: string }) => {
          this.ngZone.run(() => {
            this._invitationCancelled.next(data.invitation_id);
            // Retirer de la liste des invitations reçues
            this._receivedInvitations.next(
              this._receivedInvitations.value.filter(
                (i) => i.id !== data.invitation_id
              )
            );
          });
        })
        .listen('.room.created', (data: { room: HubRoom }) => {
          this.ngZone.run(() => {
            this._roomCreated.next(data.room);
            this._currentRoom.next(data.room);
          });
        });
    }
  }

  /**
   * Envoie une invitation à un joueur
   */
  sendInvitation(receiverId: string): Observable<{ invitation: HubInvitation }> {
    if (!this._currentHubType) {
      throw new Error('Hub not joined');
    }
    return this.apiService
      .request<{ invitation: HubInvitation }>(
        'post',
        `/hub/${this._currentHubType}/invite/${receiverId}`,
        {}
      )
      .pipe(
        tap((response) => {
          this._sentInvitation.next(response.invitation);
        }),
        catchError((error) => {
          console.error('[HubService] Error sending invitation:', error);
          throw error;
        })
      );
  }

  /**
   * Accepte une invitation
   */
  acceptInvitation(invitationId: string): Observable<{ room: HubRoom }> {
    if (!this._currentHubType) {
      throw new Error('Hub not joined');
    }
    return this.apiService
      .request<{ room: HubRoom }>(
        'post',
        `/hub/${this._currentHubType}/invitations/${invitationId}/accept`,
        {}
      )
      .pipe(
        tap((response) => {
          this._currentRoom.next(response.room);
          // Retirer l'invitation de la liste
          this._receivedInvitations.next(
            this._receivedInvitations.value.filter((i) => i.id !== invitationId)
          );
        }),
        catchError((error) => {
          console.error('[HubService] Error accepting invitation:', error);
          throw error;
        })
      );
  }

  /**
   * Refuse une invitation
   */
  declineInvitation(invitationId: string): Observable<any> {
    if (!this._currentHubType) {
      throw new Error('Hub not joined');
    }
    return this.apiService
      .request('post', `/hub/${this._currentHubType}/invitations/${invitationId}/decline`, {})
      .pipe(
        tap(() => {
          // Retirer l'invitation de la liste
          this._receivedInvitations.next(
            this._receivedInvitations.value.filter((i) => i.id !== invitationId)
          );
        }),
        catchError((error) => {
          console.error('[HubService] Error declining invitation:', error);
          throw error;
        })
      );
  }

  /**
   * Annule une invitation envoyée
   */
  cancelInvitation(invitationId: string): Observable<any> {
    if (!this._currentHubType) {
      throw new Error('Hub not joined');
    }
    return this.apiService
      .request('post', `/hub/${this._currentHubType}/invitations/${invitationId}/cancel`, {})
      .pipe(
        tap(() => {
          this._sentInvitation.next(null);
        }),
        catchError((error) => {
          console.error('[HubService] Error cancelling invitation:', error);
          throw error;
        })
      );
  }

  /**
   * Charge les invitations reçues depuis l'API
   */
  private loadReceivedInvitations(type: HubType): void {
    this.apiService
      .request<{ invitations: HubInvitation[] }>('get', `/hub/${type}/invitations`)
      .subscribe({
        next: (response) => {
          this._receivedInvitations.next(response.invitations);
        },
        error: (error) => {
          console.error('[HubService] Error loading invitations:', error);
        },
      });
  }

  /**
   * Charge l'invitation envoyée en cours
   */
  private loadSentInvitation(type: HubType): void {
    this.apiService
      .request<{ invitation: HubInvitation | null }>('get', `/hub/${type}/sent-invitation`)
      .subscribe({
        next: (response) => {
          this._sentInvitation.next(response.invitation);
        },
        error: (error) => {
          console.error('[HubService] Error loading sent invitation:', error);
        },
      });
  }

  /**
   * Récupère les infos d'une room
   */
  getRoom(roomId: string): Observable<{ room: HubRoom }> {
    return this.apiService.request<{ room: HubRoom }>('get', `/hub/rooms/${roomId}`);
  }
}

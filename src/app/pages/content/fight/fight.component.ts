import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EchoService } from '../../../shared/services/echo.service';
import { HubService } from '../../../shared/services/hub.service';
import { ApiService } from '../../../shared/services/api.service';
import { SoundService } from '../../../shared/services/sound.service';
import { HubRoom } from '../../../shared/interfaces/hub';
import { Subject, takeUntil, filter, first } from 'rxjs';

@Component({
  selector: 'app-fight',
  standalone: false,
  templateUrl: './fight.component.html',
  styleUrl: './fight.component.scss'
})
export class FightComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private echoService = inject(EchoService);
  private hubService = inject(HubService);
  private apiService = inject(ApiService);
  private soundService = inject(SoundService);
  private destroy$ = new Subject<void>();

  currentUserId: string | null = null;
  isConnected = false;
  isLoading = true;

  ngOnInit(): void {
    // Jouer la musique du lobby
    // this.soundService.playMusic('assets/sounds/lobby.mp3'); // Commented out until file exists or we use a placeholder logic

    // Récupérer l'utilisateur actuel via l'observable user$
    this.apiService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter(user => !!user),
        first()
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUserId = user.id;
            this.isLoading = false;
            
            // Se connecter à Echo avec le token depuis authState$
            this.apiService.authState$
              .pipe(first())
              .subscribe(authState => {
                if (authState.token) {
                  this.echoService.connect(authState.token);
                  this.hubService.subscribeToUserChannel(user.id);
                }
              });
          }
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });

    // Si pas d'utilisateur après un délai, recharger
    setTimeout(() => {
      if (this.isLoading && !this.currentUserId) {
        this.isLoading = false;
        // L'utilisateur n'est pas connecté
        this.router.navigate(['/login']);
      }
    }, 3000);

    // Surveiller la connexion
    this.echoService.isConnected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((connected) => {
        this.isConnected = connected;
      });
  }

  ngOnDestroy(): void {
    this.soundService.stopMusic();
    this.hubService.leaveHub();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRoomCreated(room: HubRoom): void {
    // Rediriger vers la page de combat avec l'ID de la room
    console.log('Room created:', room);
    // TODO: Implémenter la navigation vers le combat réel
    // this.router.navigate(['/content/fight', room.id]);
    this.soundService.playSfx('match_found');
  }
}

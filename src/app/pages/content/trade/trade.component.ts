import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EchoService } from '../../../shared/services/echo.service';
import { HubService } from '../../../shared/services/hub.service';
import { ApiService } from '../../../shared/services/api.service';
import { ConfettiService } from '../../../shared/services/confetti.service';
import { HubRoom } from '../../../shared/interfaces/hub';
import { ModalService } from '../../../shared/services/modal.service';
import { Subject, takeUntil, filter, first } from 'rxjs';

@Component({
  selector: 'app-trade',
  standalone: false,
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss'
})
export class TradeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private echoService = inject(EchoService);
  private hubService = inject(HubService);
  private apiService = inject(ApiService);
  private confettiService = inject(ConfettiService);
  private modalService = inject(ModalService);
  private destroy$ = new Subject<void>();

  currentUserId: string | null = null;
  isConnected = false;
  isLoading = true;

  ngOnInit(): void {
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
                  // Attendre que la connexion WebSocket soit établie avant de s'abonner
                  this.echoService.isConnected$
                    .pipe(
                      filter(connected => connected),
                      first(),
                      takeUntil(this.destroy$)
                    )
                    .subscribe(() => {
                      this.hubService.subscribeToUserChannel(user.id);
                    });
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

    // Check for query params (success or cancelled)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['success']) {
        // Trigger success animation
        this.confettiService.fireworks();
        // Clear params
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { success: null },
          queryParamsHandling: 'merge'
        });
      } else if (params['cancelled']) {
        this.modalService.alert("L'échange a été annulé.", 'Échange annulé');
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { cancelled: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.hubService.leaveHub();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRoomCreated(room: HubRoom): void {
    console.log('[Trade] Room created:', room);
    this.router.navigate(['/trade', room.id]);
  }
}

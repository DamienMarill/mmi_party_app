import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-moodle-success',
  standalone: false,
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center p-4">
      <img src="/favicon.png" alt="MMI Party" class="w-32 mb-8">
      
      <div *ngIf="isLoading" class="text-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-base-content/70">Connexion en cours...</p>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <a *ngIf="errorMessage" routerLink="/login" class="btn btn-ghost mt-4">
        Retour à la connexion
      </a>
    </div>
  `,
})
export class MoodleSuccessComponent implements OnInit {
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Get tokens from URL params
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    const refreshToken = this.route.snapshot.queryParamMap.get('refresh_token');
    const needsFinalization = this.route.snapshot.queryParamMap.get('needs_finalization') === 'true';

    if (!accessToken || !refreshToken) {
      this.isLoading = false;
      this.errorMessage = 'Tokens manquants dans la réponse';
      return;
    }

    // Login with tokens
    this.apiService.loginWithMoodleTokens(accessToken, refreshToken).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect based on finalization status
        if (needsFinalization) {
          this.router.navigate(['/login/register'], { 
            queryParams: { step: 'finalize' }
          });
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la connexion';
        console.error('Login with Moodle tokens failed:', err);
      }
    });
  }
}

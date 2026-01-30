import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-moodle-error',
  standalone: false,
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center p-4">
      <img src="/favicon.png" alt="MMI Party" class="w-32 mb-8">
      
      <div class="alert alert-error max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <a routerLink="/login" class="btn btn-primary mt-6">
        Retour à la connexion
      </a>
    </div>
  `,
})
export class MoodleErrorComponent implements OnInit {
  errorMessage = 'Une erreur est survenue lors de la connexion';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const message = this.route.snapshot.queryParamMap.get('message');
    if (message) {
      this.errorMessage = message;
    }
  }
}

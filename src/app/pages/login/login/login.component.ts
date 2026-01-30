import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../shared/services/api.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../../shared/services/config.service';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showClassicLogin = false; // Set to true for debug mode

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private configService: ConfigService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  loginWithMoodle(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getMoodleAuthUrl().subscribe({
      next: (response) => {
        // Redirect to Moodle OAuth
        window.location.href = response.url;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la connexion à Moodle';
        console.error('Moodle auth error:', err);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}

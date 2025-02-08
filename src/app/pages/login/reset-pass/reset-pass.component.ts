import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-reset-pass',
  standalone: false,

  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.scss'
})
export class ResetPassComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Récupérer les paramètres de l'URL
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (!token || !email) {
      this.router.navigate(['/login']);
      return;
    }

    this.resetForm.patchValue({
      token,
      email
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  getErrorMessage(field: string): string {
    const control = this.resetForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['email']) {
        return 'Email invalide';
      }
      if (control.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (control.errors['mismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
      if (control.errors['serverError']) {
        return control.errors['serverError'];
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.resetForm.valid && !this.loading) {
      this.loading = true;
      this.apiService.request('POST', '/auth/reset-password', this.resetForm.value)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Votre mot de passe a été réinitialisé avec succès !';
          },
          error: (error) => {
            if (error.error?.errors) {
              Object.keys(error.error.errors).forEach(key => {
                this.resetForm.get(key)?.setErrors({
                  serverError: error.error.errors[key][0]
                });
              });
            } else {
              this.resetForm.get('password')?.setErrors({
                serverError: "Une erreur est survenue, veuillez réessayer plus tard."
              });
            }
          }
        });
    }
  }
}

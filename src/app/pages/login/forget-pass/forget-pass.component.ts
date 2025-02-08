import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../shared/services/api.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-forget-pass',
  standalone: false,

  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss'
})
export class ForgetPassComponent {
  forgotForm: FormGroup;
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getErrorMessage(field: string): string {
    const control = this.forgotForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['email']) {
        return 'Adresse email invalide';
      }
      if (control.errors['serverError']) {
        return control.errors['serverError'];
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.forgotForm.valid && !this.loading) {
      this.loading = true;
      this.apiService.request('POST', '/auth/forgot-password', this.forgotForm.value)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.successMessage = 'Un email contenant les instructions de réinitialisation vous a été envoyé.';
          },
          error: (error) => {
            if (error.error?.errors?.email) {
              this.forgotForm.get('email')?.setErrors({
                serverError: error.error.errors.email[0]
              });
            } else {
              this.forgotForm.get('email')?.setErrors({
                serverError: "Une erreur est survenue, veuillez réessayer plus tard."
              });
            }
          }
        });
    }
  }
}

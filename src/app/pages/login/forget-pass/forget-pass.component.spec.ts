import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ForgetPassComponent } from './forget-pass.component';
import { ApiService } from '../../../shared/services/api.service';
import { createMockApiService } from '../../../shared/testing/test-helpers';

describe('ForgetPassComponent', () => {
  let component: ForgetPassComponent;
  let fixture: ComponentFixture<ForgetPassComponent>;
  let apiServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = createMockApiService();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ForgetPassComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPassComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid template rendering issues with custom form controls
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a forgot form', () => {
    expect(component.forgotForm).toBeDefined();
  });

  it('should have email field', () => {
    expect(component.forgotForm.get('email')).toBeTruthy();
  });

  it('should return error message for required field', () => {
    component.forgotForm.get('email')?.markAsTouched();
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('Ce champ est requis');
  });

  it('should return error message for invalid email', () => {
    component.forgotForm.patchValue({ email: 'invalid' });
    component.forgotForm.get('email')?.markAsTouched();
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('Adresse email invalide');
  });

  it('should submit form when valid', () => {
    apiServiceMock.request.and.returnValue(of({}));
    component.forgotForm.patchValue({ email: 'test@example.com' });

    component.onSubmit();

    expect(apiServiceMock.request).toHaveBeenCalledWith(
      'POST',
      '/auth/forgot-password',
      { email: 'test@example.com' }
    );
  });

  it('should show success message after submission', () => {
    apiServiceMock.request.and.returnValue(of({}));
    component.forgotForm.patchValue({ email: 'test@example.com' });

    component.onSubmit();

    expect(component.successMessage).toContain('email contenant les instructions');
  });
});

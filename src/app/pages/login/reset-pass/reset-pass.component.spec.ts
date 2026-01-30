import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ResetPassComponent } from './reset-pass.component';
import { ApiService } from '../../../shared/services/api.service';
import {
  createMockApiService,
  createMockRouter,
  createMockActivatedRouteWithQuery
} from '../../../shared/testing/test-helpers';

describe('ResetPassComponent', () => {
  let component: ResetPassComponent;
  let fixture: ComponentFixture<ResetPassComponent>;
  let apiServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    apiServiceMock = createMockApiService();
    routerMock = createMockRouter();
    activatedRouteMock = createMockActivatedRouteWithQuery({}, {
      token: 'test-token',
      email: 'test@example.com'
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ResetPassComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassComponent);
    component = fixture.componentInstance;
    // Initialize component without full change detection
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a reset form', () => {
    expect(component.resetForm).toBeDefined();
  });

  it('should populate token and email from URL params', () => {
    expect(component.resetForm.get('token')?.value).toBe('test-token');
    expect(component.resetForm.get('email')?.value).toBe('test@example.com');
  });

  it('should have password fields', () => {
    expect(component.resetForm.get('password')).toBeTruthy();
    expect(component.resetForm.get('password_confirmation')).toBeTruthy();
  });

  it('should return error message for required field', () => {
    component.resetForm.get('password')?.markAsTouched();
    component.resetForm.get('password')?.setValue('');
    const errorMessage = component.getErrorMessage('password');
    expect(errorMessage).toBe('Ce champ est requis');
  });

  it('should return error message for min length', () => {
    component.resetForm.get('password')?.setValue('short');
    component.resetForm.get('password')?.markAsTouched();
    const errorMessage = component.getErrorMessage('password');
    expect(errorMessage).toBe('Le mot de passe doit contenir au moins 8 caractères');
  });

  it('should submit form when valid', () => {
    apiServiceMock.request.and.returnValue(of({}));
    component.resetForm.patchValue({
      password: 'newPassword123',
      password_confirmation: 'newPassword123'
    });

    component.onSubmit();

    expect(apiServiceMock.request).toHaveBeenCalledWith(
      'POST',
      '/auth/reset-password',
      jasmine.objectContaining({
        token: 'test-token',
        email: 'test@example.com',
        password: 'newPassword123',
        password_confirmation: 'newPassword123'
      })
    );
  });

  it('should show success message after submission', () => {
    apiServiceMock.request.and.returnValue(of({}));
    component.resetForm.patchValue({
      password: 'newPassword123',
      password_confirmation: 'newPassword123'
    });

    component.onSubmit();

    expect(component.successMessage).toContain('réinitialisé avec succès');
  });
});

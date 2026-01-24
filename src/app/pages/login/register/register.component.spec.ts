import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterComponent } from './register.component';
import { ApiService } from '../../../shared/services/api.service';
import { createMockApiService, createMockRouter } from '../../../shared/testing/test-helpers';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    apiServiceMock = createMockApiService();
    routerMock = createMockRouter();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid template rendering issues with custom form controls
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a register form', () => {
    expect(component.registerForm).toBeDefined();
  });

  it('should start at step 1', () => {
    expect(component.currentStep).toBe(1);
  });

  it('should have expected fields in form', () => {
    expect(component.registerForm.get('firstName')).toBeTruthy();
    expect(component.registerForm.get('lastName')).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')).toBeTruthy();
    expect(component.registerForm.get('um_email')).toBeTruthy();
  });

  it('should identify student email correctly', () => {
    expect(component.isStudentEmail('test@etu.umontpellier.fr')).toBeTrue();
    expect(component.isStudentEmail('test@umontpellier.fr')).toBeFalse();
    expect(component.isStudentEmail('test@gmail.com')).toBeFalse();
  });

  it('should validate step 1', () => {
    component.currentStep = 1;
    expect(component.isStepValid()).toBeFalse();

    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1'
    });

    expect(component.isStepValid()).toBeTrue();
  });

  it('should not advance step if invalid', () => {
    component.currentStep = 1;
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  it('should go back to previous step', () => {
    component.currentStep = 2;
    component.previousStep();
    expect(component.currentStep).toBe(1);
  });
});

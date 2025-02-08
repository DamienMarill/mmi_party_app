import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {ApiService} from '../../../shared/services/api.service';
import {MmiiShape} from '../../../shared/interfaces/mmii-shape';
import {SkillAllocationComponent} from '../../../shared/layout/skill-allocation/skill-allocation.component';
import {CardStats} from '../../../shared/interfaces/card-stats';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  currentStep = 1;
  registerForm: FormGroup;
  isCodeVerified = false;
  isEmailRegistered = false;
  registrationId: string | null = null;
  isFinished = false;

  readonly UNIVERSITY_DOMAINS = ['umontpellier.fr', 'etu.umontpellier.fr'];
  @ViewChild('skillAllocation') skillAllocationComponent!: SkillAllocationComponent;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Step 1
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator()
      ]],
      confirmPassword: ['', [
        Validators.required,
        this.confirmPasswordValidator()
      ]],

      // Step 2
      um_email: ['', [Validators.required, Validators.email, this.universityEmailValidator()]],
      verificationCode: ['', [Validators.required, Validators.minLength(6)]],
      studentType: [''],

      // Step 3
      mmiiData: [''],

      // Step 4
      background: [''],
      skills: this.fb.group({
        audiovisuel: [0],
        communication: [0],
        dev: [0],
        graphisme: [0],
        trois_d: [0],
        ux_ui: [0],
      })
    }, {
      validators: [this.passwordMatchValidator]
    });

    // Écoute des changements d'email pour pré-remplir l'email universitaire
    this.registerForm.get('email')?.valueChanges.subscribe(email => {
      if (this.isUniversityEmail(email)) {
        this.registerForm.patchValue({ um_email: email });
      }
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('studentType')?.valueChanges.subscribe(type => {
      if (this.skillAllocationComponent) {
        this.skillAllocationComponent.setMaxPoints(type);
      }
    });
  }

  ngOnInit() {
    this.registerForm.get('um_email')?.valueChanges.subscribe(() => {
      this.isCodeVerified = false;
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  private isUniversityEmail(email: string): boolean {
    return this.UNIVERSITY_DOMAINS.some(domain => email.endsWith(domain));
  }

  public isStudentEmail(email: string): boolean {
    return email.endsWith('etu.umontpellier.fr');
  }

  async sendVerificationCode(email: string) {
    try {
      await this.apiService.request('POST', '/me/send_verification_code', {email: email}).toPromise();
    } catch (error) {
      this.registerForm.get('um_email')?.setErrors({ serverError: error });
    }
  }

  async registerEmail() {
    if (this.registerForm.get('email')?.valid &&
      this.registerForm.get('password')?.valid &&
      this.registerForm.get('confirmPassword')?.valid)
    {

      await this.apiService.request('POST', '/auth/register', {
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
          name: this.registerForm.get('firstName')?.value +' ' + this.registerForm.get('lastName')?.value,
          um_email: this.registerForm.get('um_email')?.value
        }, this.registerForm).subscribe((response: any) => {
          this.registrationId = response.id; // Stockage de l'ID
          this.isEmailRegistered = true;
        }, (error) => {
          this.registerForm.get('email')?.setErrors({
            serverError: { message: error.message }
          });
        });
    }
  }

  // Vérification du code
  async verifyCode() {
    if (!this.registrationId) return;

    const code = this.registerForm.get('verificationCode')?.value;

    try {
      await this.apiService.request('POST', '/me/verify_code', {
        registrationId: this.registrationId,
        code: code
      }).toPromise();

      this.isCodeVerified = true;
      if (!this.isStudentEmail(this.registerForm.get('um_email')?.value)) {
        this.nextStep()
      }
    } catch (error) {
      this.registerForm.get('verificationCode')?.setErrors({
        serverError: { message: 'Code invalide' }
      });
    }
  }


  nextStep() {
    if (this.isStepValid()) {
      if(this.currentStep === 2 &&
        (!this.isStudentEmail(this.registerForm.get('um_email')?.value) ||
         this.registerForm.get('studentType')?.value === 'other' || this.registerForm.get('studentType')?.value === '')
      ) {
        this.finishForm();
      }
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      if (this.currentStep <= 2) {
        this.isCodeVerified = false;
      }
    }
  }

  public isStepValid(): boolean {
    switch(this.currentStep) {
      case 1:
        return ['firstName', 'lastName', 'email', 'password', 'confirmPassword']
          .every(control => this.registerForm.get(control)?.valid);
      case 2:
        return this.isEmailRegistered && this.isCodeVerified; // On vérifie juste que l'email est enregistré
      case 3:
        return this.registerForm.get('mmiiData')?.value !== ''; // À implémenter
      default:
        return true;
    }
  }
  async onSubmit() {
    if (this.registerForm.valid && this.registrationId) {
      try {
        await this.apiService.request('PUT', `/auth/register/${this.registrationId}`, {
          studentType: this.registerForm.get('studentType')?.value,
          mmiiData: this.registerForm.get('mmiiData')?.value,
          background: this.registerForm.get('background')?.value,
          skills: this.registerForm.get('skills')?.value
        }, this.registerForm).toPromise();

        this.finishForm();
      } catch (error) {
        this.registerForm.setErrors({ serverError: error });
      }
    }
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      return !passwordValid ? {
        passwordRequirements: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric
        }
      } : null;
    };
  }

// Amélioration du validateur de confirmation
  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const password = control.parent.get('password');
      if (!password) {
        return null;
      }

      return password.value === control.value ? null : {
        confirmPassword: true
      };
    };
  }

  private universityEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      return this.isUniversityEmail(value) ? null : {
        universityEmail: true
      };
    };
  }

  finishForm() {
    this.isFinished = true;
  }

  updateMmii(mmii: MmiiShape) {
    this.registerForm.patchValue({ mmiiData: mmii });
  }

  updateBg(bg: string) {
    this.registerForm.patchValue({ background: bg });
  }

  updateSkills(skills: CardStats) {
    this.registerForm.get('skills')?.patchValue(skills);
  }

  protected readonly Object = Object;
}

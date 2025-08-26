import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ROLE } from '../../../@core/enums/role.enum';
import { VerificationService } from '../../../@core/services/auth/verification.service';
import { RegisterService } from '../../../@core/services/auth/register.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
  ],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {
  ROLE = ROLE;
  step = 1;

  credentialsForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private verificationService: VerificationService, private registerService: RegisterService) {
    this.credentialsForm = this.fb.group({
      email: [{value: verificationService.getEmail(), disabled: true}],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{}[\]|;:'",.<>]).+$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.passwordMatchValidator });
  }

  get c() {
    return this.credentialsForm.controls;
  }

  passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };

  nextStep() {
    if (this.credentialsForm.valid) {
      this.step = 2;
      //this.registerService.setRegisterUser(this.c.['email'].value, this.c.['password'].value )
    } else {
      this.credentialsForm.markAllAsTouched();
    }
  }

  returnStep(){
    this.step = 1;
  }

  selectUserType(type: ROLE) {
    if (type === ROLE.MENTOR) {
      this.router.navigate(['/register/mentor']);
    } else {
      this.router.navigate(['/register/mentored']);
    }
  }
}
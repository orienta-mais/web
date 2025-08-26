import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { STATES, COUNTRIES } from '../../../../shared/constants';

@Component({
  selector: 'app-register-mentor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: './register-mentor.component.html',
  styleUrls: ['./register-mentor.component.css'],
})
export class RegisterMentorComponent {
  mentorForm: FormGroup;
  states = STATES;
  nationalities = COUNTRIES;
  maxDate!: Date;
  step = 1;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.mentorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      socialMedias: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(100)]],
      state: [null, Validators.required],
      nationality: [null, Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  nextStep() {
    if (this.f['email'].valid && this.f['password'].valid) {
      this.step = 2;
    } else {
      this.f['email'].markAsTouched();
      this.f['password'].markAsTouched();
    }
  }

  handleSubmit() {
    if (this.mentorForm.valid) {
      console.log('Dados do mentor:', this.mentorForm.value);
    } else {
      this.mentorForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  get f() {
    return this.mentorForm.controls;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { STATES, COUNTRIES } from '../../../../shared/constants';
import { RegisterService } from '../../../../@core/services/auth/register.service';
import { Router } from '@angular/router';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { RegisterMentor } from '../../../../@core/interfaces/mentor.interface';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';

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
    SelectModule,
  ],
  templateUrl: './register-mentor.component.html',
  styleUrls: ['./register-mentor.component.css'],
})
export class RegisterMentorComponent implements OnInit {
  mentorForm: FormGroup;
  states = STATES;
  nationalities = COUNTRIES;
  maxDate!: Date;
  step = 1;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private mentorService: MentorService,
    private toast: ToastService,
  ) {
    this.mentorForm = this.fb.group(
      {
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['', Validators.required],
        socialMedias: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(100)]],
        state: ['', Validators.required],
        nationality: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  returnStep() {
    this.router.navigate(['/register']);
  }

  handleSubmit() {
    if (this.mentorForm.valid) {
      const mentorData: RegisterMentor = {
        email: this.registerService.getEmail()!,
        password: this.registerService.getPassword()!,
        ...this.mentorForm.getRawValue(),
      };
      this.mentorService
        .register(mentorData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toast.success('E-mail de validação reenviado com sucesso');
          },
          error: () => {
            this.toast.error(
              'Erro ao enviar email de validação. Verifique se o e-mail está correto.',
            );
          },
        });
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

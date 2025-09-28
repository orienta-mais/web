import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { STATES, COUNTRIES } from '../../../../shared/constants';
import { RegisterService } from '../../../../@core/services/auth/register.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { uuidValidator } from '../../../../@core/validators';
import { VerificationService } from '../../../../@core/services/auth/verification.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterMentor } from '../../../../@core/interfaces/mentor.interface';

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
  tokenUrl!: string;
  screenValidated = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private verificationService: VerificationService,
    private mentorService: MentorService,
    private toast: ToastService,
    private routeUrl: ActivatedRoute,
  ) {
    this.mentorForm = this.fb.group({
      email: [verificationService.getEmail(), [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{}[\]|;:'",.<>]).+$/),
        ],
      ],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
      socialMedias: ['', Validators.maxLength(100)],
      description: [
        '',
        [Validators.required, Validators.minLength(100), Validators.maxLength(500)],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(15)]],
    });
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.routeUrl.queryParamMap.subscribe((pm) => {
      const token = pm.get('token');
      if (!token || !uuidValidator(token)) {
        this.screenValidated = false;
        return;
      }
      this.tokenUrl = token;
      this.screenValidated = true;
    });
  }

  handleSubmit() {
    if (this.mentorForm.valid) {
      const mentorData: RegisterMentor = {
        ...this.mentorForm.getRawValue(),
        role: this.verificationService.getRole(),
        token: this.tokenUrl,
        state: this.mentorForm.get('state')?.value?.name,
        nationality: this.mentorForm.get('nationality')?.value?.name,
      };
      this.mentorService
        .register(mentorData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toast.success('Bem vindo a plataforma!', 5000);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (e: HttpErrorResponse) => {
            if (e.status === 400) {
              this.toast.error(e.error?.error);
            } else {
              this.toast.error('Ocorreu um erro inesperado.');
            }
          },
        });
    } else {
      this.mentorForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.mentorForm.controls;
  }

  get passwordCtrl() {
    return this.mentorForm.get('password');
  }
}

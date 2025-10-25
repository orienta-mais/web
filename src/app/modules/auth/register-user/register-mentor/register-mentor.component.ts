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
import { Router, ActivatedRoute } from '@angular/router';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { uuidValidator } from '../../../../@core/validators';
import { VerificationService } from '../../../../@core/services/auth/verification.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterMentor } from '../../../../@core/interfaces/mentor.interface';
import { isValidEmail } from '../../../../@core/validators/email/email.validator';
import { TermsCheckboxComponent } from '../../../../shared/terms-checkbox/terms-checkbox.component';
import { InputMaskModule } from 'primeng/inputmask';

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
    TermsCheckboxComponent,
    InputMaskModule,
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
  acceptedTerms = false;

  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private verificationService: VerificationService,
    private mentorService: MentorService,
    private toast: ToastService,
    private routeUrl: ActivatedRoute,
  ) {
    this.mentorForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
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
        [Validators.required, Validators.minLength(100), Validators.maxLength(1000)],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
    });
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.routeUrl.queryParamMap.subscribe((pm) => {
      const token = pm.get('token');
      const email = pm.get('email');
      if (!token || !uuidValidator(token)) {
        this.screenValidated = false;
        return;
      }

      if (!email || !isValidEmail(email)) {
        this.screenValidated = false;
        return;
      }

      this.screenValidated = true;
      this.tokenUrl = token;
      this.email = email;
      this.mentorForm.get('email')?.setValue(email);
    });
  }

  handleSubmit() {
    if (this.mentorForm.valid) {
      if (!this.acceptedTerms) {
        this.toast.error('Você deve aceitar os termos para continuar.');
        return;
      }

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
            this.toast.success('Cadastro realizado com sucesso!', 5000);
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

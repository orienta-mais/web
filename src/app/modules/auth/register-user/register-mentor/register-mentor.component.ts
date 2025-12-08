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
import { noWhitespaceValidator, uuidValidator } from '../../../../@core/validators';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterMentor } from '../../../../@core/interfaces/mentor.interface';
import { isValidEmail } from '../../../../@core/validators/email/email.validator';
import { TermsCheckboxComponent } from '../../../../shared/terms-checkbox/terms-checkbox.component';
import { InputMaskModule } from 'primeng/inputmask';
import { YEAR_USER } from '../../../../@core/enums/year-user.enum';
import { linkedinValidator } from '../../../../@core/validators/urls/linkedin.validator';

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
  showConfirmPassword = false;
  tokenUrl!: string;
  screenValidated = false;
  acceptedTerms = false;

  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{}\[\]|;:'",.<>]).+$/,
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      name: ['', [Validators.required, noWhitespaceValidator, Validators.maxLength(70)]],
      lastName: ['', [Validators.required, noWhitespaceValidator, Validators.maxLength(70)]],
      birthDate: ['', Validators.required],
      socialMedias: ['', [noWhitespaceValidator, linkedinValidator, Validators.maxLength(150)]],
      description: [
        '',
        [
          Validators.required,
          noWhitespaceValidator,
          Validators.minLength(100),
          Validators.maxLength(1000),
        ],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
    });
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - YEAR_USER.MENTOR,
      today.getMonth(),
      today.getDate(),
    );

    this.routeUrl.queryParamMap.subscribe((pm) => {
      const token = pm.get('token');
      const emailEncoded = pm.get('email');

      if (!token || !uuidValidator(token)) {
        this.screenValidated = false;
        return;
      }

      if (!emailEncoded) {
        this.screenValidated = false;
        return;
      }

      let decodedEmail: string;
      try {
        decodedEmail = decodeURIComponent(emailEncoded);
      } catch {
        decodedEmail = emailEncoded;
      }

      if (!isValidEmail(decodedEmail)) {
        this.screenValidated = false;
        return;
      }

      this.screenValidated = true;
      this.tokenUrl = token;
      this.email = decodedEmail;
      this.mentorForm.get('email')?.setValue(decodedEmail);
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
              this.toast.error(e.error?.message);
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

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get f() {
    return this.mentorForm.controls;
  }

  get passwordCtrl() {
    return this.mentorForm.get('password');
  }

  get confirmPasswordCtrl() {
    return this.mentorForm.get('confirmPassword');
  }
}

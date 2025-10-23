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
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { uuidValidator } from '../../../../@core/validators';
import { VerificationService } from '../../../../@core/services/auth/verification.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterMentored } from '../../../../@core/interfaces/mentored.interface';
import { MentoredService } from '../../../../@core/services/mentored/mentored.service';
import { isValidEmail } from '../../../../@core/validators/email/email.validator';
import { TermsCheckboxComponent } from '../../../../shared/terms-checkbox/terms-checkbox.component';
import { InputMaskModule } from 'primeng/inputmask';
import { removeMaskPhone } from '../../../../@core/utils/removeMaskPhone.utils';

@Component({
  selector: 'app-register-mentored',
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
  templateUrl: './register-mentored.component.html',
  styleUrls: ['./register-mentored.component.css'],
})
export class RegisterMentoredComponent implements OnInit {
  mentoredForm: FormGroup;
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
    private mentoredService: MentoredService,
    private toast: ToastService,
    private routeUrl: ActivatedRoute,
  ) {
    this.mentoredForm = this.fb.group({
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
      description: [
        '',
        [Validators.required, Validators.minLength(100), Validators.maxLength(500)],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(15)]],
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
      this.mentoredForm.get('email')?.setValue(email);
    });
  }

  handleSubmit() {
    if (this.mentoredForm.valid) {
      if (!this.acceptedTerms) {
        this.toast.error('Você deve aceitar os termos para continuar.');
        return;
      }

      const rawPhone = this.mentoredForm.get('phone')?.value;
      const cleanedPhone = removeMaskPhone(rawPhone);

      const mentoredData: RegisterMentored = {
        ...this.mentoredForm.getRawValue(),
        role: this.verificationService.getRole(),
        phone: cleanedPhone,
        token: this.tokenUrl,
        state: this.mentoredForm.get('state')?.value?.name,
        nationality: this.mentoredForm.get('nationality')?.value?.name,
      };

      this.mentoredService
        .register(mentoredData)
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
      this.mentoredForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.mentoredForm.controls;
  }

  get passwordCtrl() {
    return this.mentoredForm.get('password');
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordRequest } from '../../../@core/interfaces/auth.interface';
import { take } from 'rxjs/operators';
import { noWhitespaceValidator, uuidValidator } from '../../../@core/validators';
import { isValidEmail } from '../../../@core/validators/email/email.validator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  emailUrl!: string;
  tokenUrl!: string;
  screenValidated = true;
  showPassword = false;
  loading = false;
  success = false;

  constructor(
    private toast: ToastService,
    private service: AuthService,
    private fb: FormBuilder,
    private routeUrl: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{}\[\]|;:'",.<>]).+$/,
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.routeUrl.queryParamMap.subscribe((pm) => {
      const token = pm.get('token');
      const email = pm.get('email');

      if (!token || !uuidValidator(token) || !email || !isValidEmail(email)) {
        this.screenValidated = false;
        return;
      }

      this.tokenUrl = token;
      this.emailUrl = email;
    });
  }

  handleUpdatePassword() {
    if (this.form.valid) {
      this.submitUpdatePassword({
        ...this.form.value,
        token: this.tokenUrl,
        email: this.emailUrl,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitUpdatePassword(value: ResetPasswordRequest) {
    this.loading = true;

    this.service
      .resetPassword(value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.toast.success('Senha atualizada com sucesso!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toast.error(e.error?.message);
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get passwordCtrl() {
    return this.form.get('newPassword');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SendEmailForgotPasswordRequest } from '../../../@core/interfaces/auth.interface';
import { take } from 'rxjs/operators';
import { emailValidator } from '../../../@core/validators';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  sendEmailSuccess = false;

  constructor(
    private toast: ToastService,
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
    });
  }

  handleSendEmailForgotPassword() {
    if (this.form.valid) {
      this.submitSendValidateEmail(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitSendValidateEmail(value: SendEmailForgotPasswordRequest) {
    this.service
      .sendValidateEmail(value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/register/email/confirm']);
        },
        error: () => {
          this.sendEmailSuccess = true;
          this.toast.error(
            'Erro ao enviar e-mail de validação. Verifique se o e-mail está correto.',
          );
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 10000);
        },
      });
  }

  returnLogin() {
    this.router.navigate(['/login']);
  }

  get email() {
    return this.form.get('email');
  }
}

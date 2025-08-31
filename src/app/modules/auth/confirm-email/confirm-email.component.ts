import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ConfirmEmailRequest } from '../../../@core/interfaces/auth.interface';
import { take } from 'rxjs/operators';
import { VerificationService } from '../../../@core/services/auth/verification.service';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css',
})
export class ConfirmEmailComponent implements OnInit {
  form: FormGroup;
  emailUser?: string | null;
  codeSendEmailRetry = 0;

  constructor(
    private toast: ToastService,
    private verification: VerificationService,
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{4}$/)]],
    });
  }

  ngOnInit() {
    this.emailUser = this.verification.getEmail();
  }

  handleConfirmEmail() {
    if (this.form.valid) {
      this.submitConfirmEmail(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitConfirmEmail(value: ConfirmEmailRequest) {
    this.service
      .confirmEmail(value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('E-mail confirmado com sucesso');
          this.router.navigate(['/register']);
        },
        error: () => {
          this.router.navigate(['/register']);
          this.toast.error('Erro ao confirmar o e-mail. Verifique se o código está correto.');
        },
      });
  }

  returnSendEmail() {
    this.router.navigate(['/register/email/send-validation']);
  }

  retrySendEmail() {
    if (this.codeSendEmailRetry > 0) {
      return;
    }

    if (this.emailUser) {
      this.service
        .sendValidateEmail({ email: this.emailUser })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.startCountdown(30);
            this.toast.success('E-mail de validação reenviado com sucesso');
          },
          error: () => {
            this.toast.error(
              'Erro ao enviar email de validação. Verifique se o e-mail está correto.',
            );
            // setTimeout(() => {
            //   this.returnSendEmail();
            // }
            // , 3000);
            this.startCountdown(30);
          },
        });
    } else {
      this.toast.error('E-mail não encontrado. Por favor, tente novamente.');
      // setTimeout(() => {
      //   this.returnSendEmail();
      // }
      // , 3000);
    }
  }

  startCountdown(seconds: number) {
    this.codeSendEmailRetry = seconds;

    const interval = setInterval(() => {
      this.codeSendEmailRetry--;

      if (this.codeSendEmailRetry <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  get code() {
    return this.form.get('code');
  }
}

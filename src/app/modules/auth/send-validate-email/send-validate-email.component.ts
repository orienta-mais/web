import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { emailValidator } from '../../../@core/validators';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SendValidateEmailRequest } from '../../../@core/interfaces/auth.interface';

@Component({
  selector: 'app-send-validate-email',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './send-validate-email.component.html',
  styleUrl: './send-validate-email.component.css',
})
export class SendValidateEmailComponent {
  form: FormGroup;

  constructor(
    private toast: ToastService,
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
    });
  }

  handleSendValidateEmail() {
    if (this.form.valid) {
      this.submitSendValidateEmail(
        this.form.value as SendValidateEmailRequest
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitSendValidateEmail(value: SendValidateEmailRequest) {
    this.service.sendValidateEmail(value).subscribe({
      next: () => {
        this.toast.success('E-mail de validação enviado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao enviar e-mail de validação:', error);
        this.toast.error(
          'Erro ao enviar e-mail de validação. Verifique se o e-mail está correto.'
        );
      },
    });
  }

  returnLogin() {
    this.router.navigate(['/login']);
  }

  get email() { return this.form.get('email'); }
}

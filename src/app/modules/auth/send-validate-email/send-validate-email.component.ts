import { Component, OnInit } from '@angular/core';
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
import { VerificationService } from '../../../@core/services/auth/verification.service';
import { ROLE } from '../../../@core/enums/role.enum';

@Component({
  selector: 'app-send-validate-email',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './send-validate-email.component.html',
  styleUrls: ['./send-validate-email.component.css'],
})
export class SendValidateEmailComponent implements OnInit {
  form!: FormGroup; // Usando o operador "!"
  selectedRole: ROLE | null = null; // Armazena o role selecionado
  step: 'role' | 'email' = 'role'; // Controla o passo atual
  ROLE = ROLE; // Enum para usar no template

  constructor(
    private verificationService: VerificationService,
    private toast: ToastService,
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
    });
    this.verificationService.clear();
  }

  selectRole(role: ROLE): void {
    this.selectedRole = role;
    this.step = 'email';
  }

  handleSendValidateEmail(): void {
    if (this.form.valid && this.selectedRole) {
      const email = this.form.value.email;
      this.verificationService.setPendingVerification(this.selectedRole, email);
      const value: SendValidateEmailRequest = { email };
      this.submitSendValidateEmail(value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Método para submeter o email à API
  submitSendValidateEmail(value: SendValidateEmailRequest): void {
    this.service.sendValidateEmail(value).subscribe({
      next: () => {
        this.toast.success('E-mail enviado com sucesso! Verifique sua caixa de entrada.', 5000);
      },
      error: () => {
        this.toast.error('Erro ao enviar o e-mail. Tente novamente mais tarde.');
      },
    });
  }

  handleBack() {
    this.step = 'role';
  }

  returnLogin() {
    this.router.navigate(['/login']);
  }

  get email() {
    return this.form.get('email');
  }
}

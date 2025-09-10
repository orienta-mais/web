import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { emailValidator } from '../../../@core/validators';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { LoginRequest } from '../../../@core/interfaces/auth.interface';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { VerificationService } from '../../../@core/services/auth/verification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private toast: ToastService,
    private service: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private verificationService: VerificationService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', Validators.required],
    });
    verificationService.clear();
  }

  handleLogin() {
    if (this.loginForm.valid) {
      this.submitLogin(this.loginForm.value as LoginRequest);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  submitLogin(values: LoginRequest) {
    const body: LoginRequest = {
      email: values.email,
      password: values.password,
    };
    this.service
      .login(body)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          
          this.router.navigate(['/home']);
          this.toast.success('Login realizado com sucesso');
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.toast.error('Erro ao realizar login. Verifique suas credenciais.');
        },
      });
  }

  forgotPassword() {
    this.router.navigate(['/password/forgot']);
  }

  register() {
    this.router.navigate(['/register/email/send-validation']);
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}

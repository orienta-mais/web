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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-send-validate-email',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './send-validate-email.component.html',
  styleUrls: ['./send-validate-email.component.css'],
})
export class SendValidateEmailComponent implements OnInit {
  form!: FormGroup;
  selectedRole: ROLE | null = null;
  step: 'role' | 'email' | 'success' = 'role';
  ROLE = ROLE;

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

  submitSendValidateEmail(value: SendValidateEmailRequest): void {
    this.service.sendValidateEmail(value).subscribe({
      next: () => {
        this.step = 'success';
        this.returnLogin();
      },
      error: (e: HttpErrorResponse) => {
        this.toast.error(e.error?.error);
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

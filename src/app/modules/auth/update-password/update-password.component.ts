import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UpdatePasswordRequest } from '../../../@core/interfaces/auth.interface';
import { take } from 'rxjs/operators';
import { uuidValidator } from '../../../@core/validators';

@Component({
  selector: 'app-update-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;
  uuidUrl!: string;
  screenValidated = false;

  constructor(
    private toast: ToastService,
    private service: AuthService,
    private fb: FormBuilder,
    private routeUrl: ActivatedRoute
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {
    this.routeUrl.paramMap.subscribe((pm) => {
      const uuid = pm.get('uuid');

      if (!uuid || !uuidValidator(uuid)) {
        this.screenValidated = false;
        return;
      }

      this.uuidUrl = uuid;
      this.validateServiceUUID(uuid);
    });
  }

  handleUpdatePassword() {
    if (this.form.valid) {
      this.submitUpdatePassword({
        ...this.form.value,
        uuid: this.uuidUrl,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitUpdatePassword(value: UpdatePasswordRequest) {
    this.service
      .updatePassword(value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Senha atualizada com sucesso');
        },
        error: () => {
          this.toast.error(
            'Erro ao atualizar a senha. Verifique se atende aos requisitos.'
          );
        },
      });
  }

  validateServiceUUID(uuid: string): void {
    this.service
      .validateUUIDPasswordReset({ uuid })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.screenValidated = true;
        },
        error: () => {
          this.screenValidated = true;
        },
      });
  }

  get newPassword() {
    return this.form.get('newPassword');
  }
}
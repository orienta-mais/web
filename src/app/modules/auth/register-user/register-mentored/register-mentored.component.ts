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
import { RegisterService } from '../../../../@core/services/auth/register.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { RegisterMentored } from '../../../../@core/interfaces/mentored.interface';
import { MentoredService } from '../../../../@core/services/mentored/mentored.service';
@Component({
  selector: 'app-register-mentored',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './register-mentored.component.html',
  styleUrl: './register-mentored.component.css',
})
export class RegisterMentoredComponent implements OnInit {
  mentoredForm: FormGroup;
  states = STATES;
  nationalities = COUNTRIES;
  maxDate!: Date;
  step = 1;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private mentoredService: MentoredService,
    private toast: ToastService,
  ) {
    this.mentoredForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      codeBolsaFamilia: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(100)]],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
    });
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  returnStep() {
    this.router.navigate(['/register']);
  }

  handleSubmit() {
    if (this.mentoredForm.valid) {
      const mentoredData: RegisterMentored = {
        email: this.registerService.getEmail()!,
        password: this.registerService.getPassword()!,
        ...this.mentoredForm.getRawValue(),
      };
      this.mentoredService
        .register(mentoredData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toast.success('E-mail de validação reenviado com sucesso');
          },
          error: () => {
            this.toast.error(
              'Erro ao enviar email de validação. Verifique se o e-mail está correto.',
            );
          },
        });
    } else {
      this.mentoredForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get f() {
    return this.mentoredForm.controls;
  }
}

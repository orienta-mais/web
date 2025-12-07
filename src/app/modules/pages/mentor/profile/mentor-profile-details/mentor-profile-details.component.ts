import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { COUNTRIES, STATES } from '../../../../../shared/constants';
import { Router } from '@angular/router';
import { MentorService } from '../../../../../@core/services/mentor/mentor.service';
import { UserService } from '../../../../../@core/services/user/user.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { YEAR_USER } from '../../../../../@core/enums/year-user.enum';

@Component({
  selector: 'app-mentor-profile-details',
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
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './mentor-profile-details.component.html',
})
export class MentorProfileDetailsComponent implements OnInit {
  form!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  maxDate!: Date;
  states = STATES;
  nationalities = COUNTRIES;
  editMode = false;
  editPassword = false;
  mentorId: string | null = null;

  showCurrentPassword = false;
  showNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private toast: ToastService,
    private router: Router,
    private confirmService: ConfirmationService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.mentorId = this.userService.getId();
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - YEAR_USER.MENTOR,
      today.getMonth(),
      today.getDate(),
    );
    this.initializeForm();
    this.initializePasswordForm();
    this.loadMentorData();
  }

  initializeForm() {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(70)]],
      lastName: ['', [Validators.required, Validators.maxLength(70)]],
      birthDate: ['', Validators.required],
      socialMedias: ['', Validators.maxLength(255)],
      description: [
        '',
        [Validators.required, Validators.minLength(100), Validators.maxLength(1000)],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
    });
  }

  initializePasswordForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{}[\]|;:'",.<>]).+$/),
        ],
      ],
    });
  }

  loadMentorData() {
    if (this.mentorId) {
      this.mentorService
        .getProfile(this.mentorId)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.form.patchValue({
              email: data.email,
              name: data.name,
              lastName: data.lastName,
              birthDate: new Date(data.birthDate),
              socialMedias: data.socialMedias,
              description: data.description,
              state: this.states.find((s) => s.name === data.state),
              nationality: this.nationalities.find((n) => n.name === data.nationality),
            });
          },
          error: () => {
            this.toast.error('Erro ao carregar dados do mentor.');
          },
        });
    }
  }

  enableEdit() {
    this.editMode = true;
    this.editPassword = false;
  }

  cancelEdit() {
    this.editMode = false;
    this.loadMentorData();
  }

  enablePasswordEdit() {
    this.editPassword = true;
    this.editMode = false;
  }

  cancelPasswordEdit() {
    this.editPassword = false;
    this.passwordForm.reset();
  }

  handleUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      state: this.form.get('state')?.value?.name,
      nationality: this.form.get('nationality')?.value?.name,
    };

    this.loading = true;

    if (this.mentorId) {
      this.mentorService
        .updateProfile(this.mentorId, payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toast.success('Perfil atualizado com sucesso!');
            this.loading = false;
            this.editMode = false;
          },
          error: (e: HttpErrorResponse) => {
            this.toast.error(e.error?.message || 'Erro ao atualizar perfil.');
            this.loading = false;
          },
        });
    }
  }

  handlePasswordUpdate() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.form.getRawValue().email,
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
    };

    this.loading = true;

    this.mentorService
      .updatePassword(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Senha atualizada com sucesso!');
          this.loading = false;
          this.editPassword = false;
          this.passwordForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.toast.error(e.error?.message || 'Erro ao atualizar senha.');
          this.loading = false;
        },
      });
  }

  confirmDelete() {
    this.confirmService.confirm({
      message: 'Ao excluir sua conta de mentor, todas as suas informações pessoais serão removidas permanentemente. </br> As informações das aulas criadas serão mantidas e seu nome completo continuará registrado somente para fins de certificados dos alunos.</br>Esta ação é irreversível. Deseja realmente excluir sua conta?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.deleteProfile(),
    });
  }

  deleteProfile() {
    if (this.mentorId) {
      this.mentorService
        .deleteAccount(this.mentorId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toast.success('Conta excluída com sucesso!');
            this.router.navigate(['/login']);
          },
          error: () => {
            this.toast.error('Erro ao excluir conta.');
          },
        });
    }
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  goBack() {
    this.editMode = false;
    this.editPassword = false;
  }

  get f() {
    return this.form.controls;
  }

  get fpass() {
    return this.passwordForm.controls;
  }
}

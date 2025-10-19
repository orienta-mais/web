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
  loading = false;
  maxDate!: Date;
  states = STATES;
  nationalities = COUNTRIES;
  editMode = false;
  mentorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private toast: ToastService,
    private router: Router,
    private confirmService: ConfirmationService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.initializeForm();
    this.loadMentorData();
    this.mentorId = this.userService.getId();
  }

  initializeForm() {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(15)]],
      socialMedias: ['', Validators.maxLength(100)],
      description: [
        '',
        [Validators.required, Validators.minLength(100), Validators.maxLength(500)],
      ],
      state: ['', Validators.required],
      nationality: ['', Validators.required],
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
              //phone: data.phone,
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
  }

  cancelEdit() {
    this.editMode = false;
    this.loadMentorData(); // restaura os dados originais
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
            this.toast.error(e.error?.error || 'Erro ao atualizar perfil.');
            this.loading = false;
          },
        });
    }
  }

  confirmDelete() {
    this.confirmService.confirm({
      message: 'Tem certeza que deseja excluir sua conta?',
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

  goBack() {
    this.router.navigate(['/']);
  }

  get f() {
    return this.form.controls;
  }
}

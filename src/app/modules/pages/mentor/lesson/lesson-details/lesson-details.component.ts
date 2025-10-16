import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { LeasonDetailsResponse } from '../../../../../@core/interfaces/mentor.interface';
import { FloatLabelModule } from 'primeng/floatlabel';
import { take } from 'rxjs';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-lesson-details',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    ConfirmDialogModule,
    FloatLabelModule,
  ],
  templateUrl: './lesson-details.component.html',
})
export class LeasonDetailsComponent implements OnInit {
  leason?: LeasonDetailsResponse;
  form!: FormGroup;
  loading = false;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leasonService: LessonService,
    private fb: FormBuilder,
    private toast: ToastService,
    private confirmService: ConfirmationService,
  ) {}

  ngOnInit() {
    console.log('[LeasonDetails] ngOnInit');

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLeason(id);
    }
  }

  loadLeason(id: string) {
    this.leasonService
      .findLessonById(id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.leason = data;
          this.form = this.fb.group({
            id: [data.id],
            title: [data.title, Validators.required],
            description: [data.description, Validators.required],
            date: [new Date(data.date), Validators.required],
            initialTime: [data.initialTime, Validators.required],
            finalTime: [data.finalTime, Validators.required],
          });
        },
        error: () => this.toast.error('Erro ao carregar aula'),
      });
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
  }

  handleUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.leasonService
      .updateLesson(this.form.value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula atualizada com sucesso!');
          this.loading = false;
          this.editMode = false;
        },
        error: () => {
          this.toast.error('Erro ao atualizar aula.');
          this.loading = false;
        },
      });
  }

  confirmDelete() {
    this.confirmService.confirm({
      message: 'Tem certeza que deseja excluir esta aula?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-green',
      accept: () => this.deleteLeason(),
    });
  }

  deleteLeason() {
    if (!this.leason?.id) return;

    this.leasonService
      .deleteLesson(this.leason.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula excluída com sucesso!');
          this.router.navigate(['/lesson']);
        },
        error: () => this.toast.error('Erro ao excluir aula.'),
      });
  }
}

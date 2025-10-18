import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { UserService } from '../../../../../@core/services/user/user.service';

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
  lessonId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leasonService: LessonService,
    private fb: FormBuilder,
    private toast: ToastService,
    private confirmService: ConfirmationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('id');
    if (this.lessonId) this.loadLeason(this.lessonId);
  }

  loadLeason(lessonId: string) {
    this.leasonService
      .findLessonById(lessonId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.leason = data;
          this.form = this.fb.group({
            title: [data.title, [Validators.required]],
            description: [data.description, [Validators.required]],
            date: [data.date ? new Date(data.date) : null, Validators.required],
            initialTime: [data.startTime?.slice(0, 5) || '', Validators.required],
            finalTime: [data.endTime?.slice(0, 5) || '', Validators.required],
            mentorId: [this.userService.getId()],
          });

          this.cdr.detectChanges();
        },
        error: () => this.toast.error('Erro ao carregar aula'),
      });
  }

  enableEdit() {
    this.editMode = true;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editMode = false;

    if (this.leason && this.form) {
      this.form.reset({
        title: this.leason.title,
        description: this.leason.description,
        date: new Date(this.leason.date),
        initialTime: this.leason.startTime?.slice(0, 5) || '',
        finalTime: this.leason.endTime?.slice(0, 5) || '',
        mentorId: this.userService.getId(),
      });
    }
  }

  handleUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, date, initialTime, finalTime } = this.form.value;

    const payload = {
      title,
      description,
      date: new Date(date).toISOString().split('T')[0],
      startTime: initialTime,
      endTime: finalTime,
      mentorId: this.userService.getId(),
    };

    this.loading = true;
    this.leasonService
      .updateLesson(payload, this.leason!.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula atualizada com sucesso!');
          this.loadLeason(this.leason!.id);
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
      acceptButtonStyleClass: 'p-button-success',
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

  returnBack() {
    this.router.navigate(['/lesson']);
  }

  get f() {
    return this.form.controls;
  }
}

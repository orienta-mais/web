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
import { HttpErrorResponse } from '@angular/common/http';

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
            title: [data.title, [Validators.required, Validators.maxLength(200)]],
            description: [data.description, [Validators.required, Validators.maxLength(1000)]],
            presentCode: [data.presentCode, [Validators.required, Validators.maxLength(5)]],
            date: [this.parseDate(data.date), Validators.required],
            initialTime: [data.startTime?.slice(0, 5) || '', Validators.required],
            finalTime: [data.endTime?.slice(0, 5) || '', Validators.required],
            mentorId: [this.userService.getId()],
          });

          this.cdr.detectChanges();
        },
        error: () => this.toast.error('Erro ao carregar aula.'),
      });
  }

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const d = new Date(dateString);
    const local = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return local;
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
        presentCode: this.leason.presentCode,
        date: this.parseDate(this.leason.date),
        initialTime: this.leason.startTime?.slice(0, 5),
        finalTime: this.leason.endTime?.slice(0, 5),
        mentorId: this.userService.getId(),
      });
    }
  }

  handleUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const { title, description, date, initialTime, finalTime, presentCode } = this.form.value;

    const [hInit, mInit] = initialTime.split(':').map(Number);
    const [hEnd, mEnd] = finalTime.split(':').map(Number);
    const diffHours = hEnd + mEnd / 60 - (hInit + mInit / 60);

    if (diffHours <= 0) {
      this.toast.error('A hora de término deve ser posterior à de início.');
      return;
    }

    if (diffHours > 6) {
      this.toast.error('A aula não pode ter mais de 6 horas de duração.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      presentCode: presentCode.trim(),
      date: this.formatDate(date),
      startTime: this.ensureTimeFormat(initialTime),
      endTime: this.ensureTimeFormat(finalTime),
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
        error: (e: HttpErrorResponse) => {
          this.toast.error(e.error?.message || 'Erro ao atualizar aula.');
          this.loading = false;
        },
      });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const corrected = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return corrected.toISOString().split('T')[0];
  }

  private ensureTimeFormat(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
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
          this.router.navigate(['/mentor/lesson']);
        },
        error: () => this.toast.error('Erro ao excluir aula.'),
      });
  }

  returnBack() {
    this.router.navigate(['/mentor/lesson']);
  }

  get f() {
    return this.form.controls;
  }
}

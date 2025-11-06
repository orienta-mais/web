import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../@core/services/user/user.service';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { CreateLesson } from '../../../../../@core/interfaces/mentor.interface';

@Component({
  selector: 'app-create-lesson',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
  ],
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css'],
})
export class CreateLeasonComponent {
  form: FormGroup;
  loading = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private userService: UserService,
    private lessonService: LessonService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      presentCode: [null, Validators.required, Validators.maxLength(5)],
      date: [null, [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const { title, description, date, startTime, endTime } = this.form.value;

    const [hInit, mInit] = startTime.split(':').map(Number);
    const [hEnd, mEnd] = endTime.split(':').map(Number);
    const diffHours = hEnd + mEnd / 60 - (hInit + mInit / 60);

    if (diffHours <= 0) {
      this.toast.error('A hora de término deve ser posterior à de início.');
      return;
    }

    if (diffHours > 6) {
      this.toast.error('A aula não pode ter mais de 6 horas de duração.');
      return;
    }

    const mentorId = this.userService.getId();
    if (!mentorId) {
      this.toast.error('Erro ao identificar mentor. Faça login novamente.');
      return;
    }

    const payload: CreateLesson = {
      title: title.trim(),
      description: description?.trim(),
      date: this.formatDate(date),
      startTime: this.ensureTimeFormat(startTime),
      endTime: this.ensureTimeFormat(endTime),
      mentorId,
    };

    if (!startTime || !endTime) {
      this.toast.error('Preencha os horários de início e fim.');
      return;
    }

    this.loading = true;

    this.lessonService
      .createLeason(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula cadastrada com sucesso!');
          this.form.reset();
          this.loading = false;
          this.router.navigate(['/mentor/lesson']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          const msg =
            e.error?.message ||
            e.error?.message ||
            'Erro ao cadastrar aula. Verifique os dados e tente novamente.';
          this.toast.error(msg);
        },
      });
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private ensureTimeFormat(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
  }

  get f() {
    return this.form.controls;
  }

  goBack() {
    this.router.navigate(['/mentor/lesson']);
  }
}

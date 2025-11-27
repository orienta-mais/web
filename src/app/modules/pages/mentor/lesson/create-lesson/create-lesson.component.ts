import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
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

  @ViewChildren('linkInput') linkInputs!: QueryList<ElementRef>;

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
      presentCode: [null, Validators.required],
      maxGuest: [null, [Validators.required, Validators.min(1)]],
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      additionalLinks: this.fb.array([]),
    });
  }

  get additionalLinks(): FormArray {
    return this.form.get('additionalLinks') as FormArray;
  }

  addLink() {
    this.additionalLinks.push(this.fb.control(''));

    setTimeout(() => {
      const last = this.linkInputs.last;
      if (last) last.nativeElement.focus();
    }, 50);
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  onLinkBlur(index: number) {
    const value = this.additionalLinks.at(index).value?.trim();

    if (!value) {
      this.removeLink(index);
    }
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const { title, description, date, startTime, endTime, maxGuest, additionalLinks } =
      this.form.value;

    // --------------------------
    const [hInit, mInit] = startTime.split(':').map(Number);
    const [hEnd, mEnd] = endTime.split(':').map(Number);

    const startDateTime = new Date(date);
    startDateTime.setHours(hInit, mInit, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(hEnd, mEnd, 0, 0);
    const now = new Date();

    // --------------------------
    // ❌ Aula não pode começar no passado
    // --------------------------
    if (startDateTime <= now) {
      this.toast.error('A data e hora de início não podem estar no passado.');
      return;
    }

    // --------------------------
    // ❌ Término não pode ser antes do início
    // --------------------------
    if (endDateTime <= startDateTime) {
      this.toast.error('A hora de término deve ser posterior à de início.');
      return;
    }

    // --------------------------
    // 🔵 Verifica duração (máx. 6h)
    // --------------------------
    const diffHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    if (diffHours > 6) {
      this.toast.error('A aula não pode ter mais de 6 horas de duração.');
      return;
    }

    const mentorId = this.userService.getId();

    const filteredLinks = (additionalLinks || [])
      .map((l: string) => l?.trim())
      .filter((l: string) => l);

    const payload: CreateLesson = {
      title: title.trim(),
      description: description?.trim(),
      presentCode: this.form.value.presentCode,
      maxGuest: Number(maxGuest),
      date: this.formatDate(date),
      startTime: this.ensureTimeFormat(startTime),
      endTime: this.ensureTimeFormat(endTime),
      mentorId,
      additionalLinks: filteredLinks,
    };

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
          const msg = e.error?.message || 'Erro ao cadastrar aula.';
          this.toast.error(msg);
        },
      });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private ensureTimeFormat(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
  }

  goBack() {
    this.router.navigate(['/mentor/lesson']);
  }
}

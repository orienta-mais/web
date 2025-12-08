import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
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
import { noWhitespaceValidator, safeUrlValidator } from '../../../../../@core/validators';
import { DateTimeService } from '../../../../../@core/services/datetime/datetime.service';

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
  leason?: LeasonDetailsResponse & { additionalLinks?: string[] };
  form!: FormGroup;
  loading = false;
  editMode = false;
  lessonId: string | null = null;
  lessonFinalized = false;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leasonService: LessonService,
    private fb: FormBuilder,
    private toast: ToastService,
    private confirmService: ConfirmationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
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
          const links = data.additionalLinks ?? [];
          this.leason = { ...data, additionalLinks: links };

          const localDate = this.dateTimeService.utcDateToLocalDate(data.date);
          const localStartTime = this.dateTimeService.utcTimeToLocalTime(
            data.date,
            data.startTime || '00:00:00',
          );
          const localEndTime = this.dateTimeService.utcTimeToLocalTime(
            data.date,
            data.endTime || '00:00:00',
          );

          this.form = this.fb.group({
            title: [
              data.title,
              [Validators.required, noWhitespaceValidator, Validators.maxLength(200)],
            ],
            description: [
              data.description,
              [Validators.required, noWhitespaceValidator, Validators.maxLength(1000)],
            ],
            presentCode: [
              data.presentCode,
              [Validators.required, noWhitespaceValidator, Validators.maxLength(6)],
            ],
            date: [localDate, Validators.required],
            initialTime: [localStartTime, Validators.required],
            finalTime: [localEndTime, Validators.required],
            mentorId: [this.userService.getId()],
            additionalLinks: this.fb.array(
              links.map((l) => this.fb.control(l, [safeUrlValidator])),
            ),
            maxGuest: [data.maxGuest ?? 1, [Validators.required, Validators.min(1)]],
          });

          this.cdr.detectChanges();

          this.validateLessonFinalized();
        },
        error: () => this.toast.error('Erro ao carregar aula.'),
      });
  }

  validateLessonFinalized() {
    if (this.leason?.date && this.leason?.startTime) {
      this.lessonFinalized = this.dateTimeService.isInPast(this.leason.date, this.leason.startTime);
    }
  }

  get additionalLinks(): FormArray {
    return this.form.get('additionalLinks') as FormArray;
  }

  get additionalLinksControls(): FormControl[] {
    return this.additionalLinks.controls as FormControl[];
  }

  addLink() {
    const ctrl = new FormControl('', [safeUrlValidator]);
    this.additionalLinks.push(ctrl);

    setTimeout(() => {
      const inputs = document.querySelectorAll('#additionalLink');
      const last = inputs[inputs.length - 1] as HTMLInputElement | undefined;
      last?.focus();
    }, 0);
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  removeLinkIfEmpty(index: number) {
    const value = this.additionalLinks.at(index).value;
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      this.removeLink(index);
    }
  }

  enableEdit() {
    this.editMode = true;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editMode = false;
    if (this.lessonId) this.loadLeason(this.lessonId);
  }

  handleUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const selectedDate = this.form.value.date;
    const startTime = this.form.value.initialTime;
    const endTime = this.form.value.finalTime;

    const startDateTime = this.dateTimeService.createLocalDateTime(selectedDate, startTime);
    const endDateTime = this.dateTimeService.createLocalDateTime(selectedDate, endTime);
    const now = this.dateTimeService.now();

    if (startDateTime < now) {
      this.toast.error('A data e hora de início não podem estar no passado.');
      return;
    }

    if (endDateTime <= startDateTime) {
      this.toast.error('A hora de término deve ser posterior à de início.');
      return;
    }

    const hoursDiff = this.dateTimeService.diffInHours(startDateTime, endDateTime);
    if (hoursDiff > 6) {
      this.toast.error('A aula não pode ter mais de 6 horas de duração.');
      return;
    }

    const cleanLinks =
      (this.additionalLinks.value as string[] | undefined)
        ?.map((l) => (l ? l.trim() : ''))
        .filter((l) => l && l.length > 0) ?? [];

    const startUTC = this.dateTimeService.localToUTC(selectedDate, startTime);
    const endUTC = this.dateTimeService.localToUTC(selectedDate, endTime);

    const payload: any = {
      title: this.form.value.title.trim(),
      maxGuest: this.form.value.maxGuest,
      description: (this.form.value.description ?? '').trim(),
      presentCode: (this.form.value.presentCode ?? '').trim(),
      date: startUTC.date,
      startTime: startUTC.time,
      endTime: endUTC.time,
      mentorId: this.userService.getId(),
      ...(cleanLinks.length > 0 ? { additionalLinks: cleanLinks } : {}),
    };

    this.loading = true;

    this.leasonService
      .updateLesson(payload, this.leason!.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula atualizada com sucesso!');
          if (this.leason?.id) this.loadLeason(this.leason.id);
          this.loading = false;
          this.editMode = false;
        },
        error: (e: HttpErrorResponse) => {
          this.toast.error(e.error?.message || 'Erro ao atualizar aula.');
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

  formatDate(): string {
    if (!this.leason?.date || !this.leason?.startTime) return '';
    const localDate = this.dateTimeService.utcToLocal(
      this.leason.date,
      this.dateTimeService.ensureTimeSeconds(this.leason.startTime),
    );
    return this.dateTimeService.formatDateBR(localDate);
  }

  formatStartTime(): string {
    if (!this.leason?.date || !this.leason?.startTime) return '';
    return this.dateTimeService.utcTimeToLocalTime(this.leason.date, this.leason.startTime);
  }

  formatEndTime(): string {
    if (!this.leason?.date || !this.leason?.endTime) return '';
    return this.dateTimeService.utcTimeToLocalTime(this.leason.date, this.leason.endTime);
  }

  get f() {
    return this.form.controls;
  }
}

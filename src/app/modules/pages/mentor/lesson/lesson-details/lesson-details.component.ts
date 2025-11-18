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
          const links = data.additionalLinks ?? [];
          this.leason = { ...data, additionalLinks: links };

          this.form = this.fb.group({
            title: [data.title, [Validators.required, Validators.maxLength(200)]],
            description: [data.description, [Validators.required, Validators.maxLength(1000)]],
            presentCode: [data.presentCode, [Validators.required, Validators.maxLength(5)]],
            date: [this.parseDate(data.date), Validators.required],
            initialTime: [data.startTime?.slice(0, 5) || '', Validators.required],
            finalTime: [data.endTime?.slice(0, 5) || '', Validators.required],
            mentorId: [this.userService.getId()],
            additionalLinks: this.fb.array(links.map((l) => this.fb.control(l))),
            maxGuest: [data.maxGuest ?? 1, [Validators.required, Validators.min(1)]],
          });

          this.cdr.detectChanges();
        },
        error: () => this.toast.error('Erro ao carregar aula.'),
      });
  }

  get additionalLinks(): FormArray {
    return this.form.get('additionalLinks') as FormArray;
  }

  get additionalLinksControls(): FormControl[] {
    return this.additionalLinks.controls as FormControl[];
  }

  addLink() {
    const ctrl = new FormControl('');
    this.additionalLinks.push(ctrl);

    setTimeout(() => {
      const inputs = document.querySelectorAll('input[placeholder="https://..."]');
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

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const d = new Date(dateString);
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
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

    const cleanLinks =
      (this.additionalLinks.value as string[] | undefined)
        ?.map((l) => (l ? l.trim() : ''))
        .filter((l) => l && l.length > 0) ?? [];

    const payload: any = {
      title: this.form.value.title.trim(),
      maxGuest: this.form.value.maxGuest,
      description: (this.form.value.description ?? '').trim(),
      presentCode: (this.form.value.presentCode ?? '').trim(),
      date: this.formatDate(this.form.value.date),
      startTime: this.ensureTimeFormat(this.form.value.initialTime),
      endTime: this.ensureTimeFormat(this.form.value.finalTime),
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

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  private ensureTimeFormat(time: string): string {
    return time && time.length === 5 ? time + ':00' : time;
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

  get f() {
    return this.form.controls;
  }
}

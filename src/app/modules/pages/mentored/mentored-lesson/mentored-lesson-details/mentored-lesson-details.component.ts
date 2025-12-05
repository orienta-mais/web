import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { take, forkJoin } from 'rxjs';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { LeasonDetailsResponse } from '../../../../../@core/interfaces/mentor.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../@core/services/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mentored-lesson-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, FormsModule],
  providers: [ConfirmationService],
  templateUrl: './mentored-lesson-details.component.html',
})
export class MentoredLessonDetailsComponent implements OnInit {
  lesson?: LeasonDetailsResponse;
  loading = false;
  isRegistered = false;

  showPresenceInput = false;
  showFeedback = false;
  presenceCode = '';
  feedbackText = '';
  hasStarted = false;

  registerLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService,
    private toast: ToastService,
    private confirmService: ConfirmationService,
    private userService: UserService,
    private location: Location,
  ) {}

  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    const userId = this.userService.getId();

    if (lessonId && userId) {
      this.loading = true;

      forkJoin({
        lesson: this.lessonService.findLessonById(lessonId),
        registered: this.lessonService.findAllRegisteredLessonsByMentored(userId),
      })
        .pipe(take(1))
        .subscribe({
          next: ({ lesson, registered }) => {
            this.lesson = lesson;
            this.isRegistered = registered.some((r) => r.id === lessonId);
            this.loading = false;
            this.showBoxLessonStarted();
          },
          error: () => {
            this.toast.error('Erro ao carregar detalhes da aula.');
            this.loading = false;
          },
        });
    }
  }

  showBoxLessonStarted() {
    if (this.lesson?.date && this.lesson?.startTime) {
      const dateTimeString = `${this.lesson.date}T${this.lesson.startTime}`;
      const lessonStart = new Date(dateTimeString);
      const now = new Date();

      this.hasStarted = lessonStart <= now;
    }
  }

  confirmRegister() {
    this.confirmService.confirm({
      header: 'Confirmar inscrição',
      message: 'Você deseja se cadastrar nesta aula?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, quero me cadastrar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.registerInLesson(),
    });
  }

  registerInLesson() {
    if (!this.lesson?.id) return;
    this.registerLoading = true;

    this.lessonService
      .registerMentoredInLesson(this.lesson.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Cadastro realizado com sucesso!');
          this.isRegistered = true;
          this.registerLoading = false;
        },
        error: (e: HttpErrorResponse) => {
          this.toast.error(e.error?.message);
          this.registerLoading = false;
        },
      });
  }

  submitPresence() {
    if (this.presenceCode.trim().length === 0) {
      this.toast.error('Por favor, insira o código de presença.');
      return;
    }

    this.lessonService
      .sendPresenceCode(this.lesson!.id, this.presenceCode)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Presença confirmada!');
          this.lesson!.presentCodeFilled = true;
        },
        error: (e: HttpErrorResponse) => this.toast.error(e.error?.message),
      });
  }

  downloadCertificate() {
    this.lessonService
      .downloadCertificate(this.lesson!.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Certificado enviado por email!');
        },
        error: () => this.toast.error('Erro ao baixar certificado.'),
      });
  }

  sendFeedback() {
    this.router.navigate([`/mentored/review/mentor/${this.lesson?.mentorId}`]);
  }

  returnBack() {
    this.location.back();
  }

  viewDetailsMentor() {
    this.router.navigate([`/mentored/review/mentor/${this.lesson?.mentorId}`]);
  }
}

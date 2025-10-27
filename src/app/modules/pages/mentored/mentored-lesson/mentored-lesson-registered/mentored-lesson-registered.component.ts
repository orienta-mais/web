import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { LeasonListResponse as LessonListResponse } from '../../../../../@core/interfaces/mentor.interface';
import { UserService } from '../../../../../@core/services/user/user.service';

@Component({
  selector: 'app-mentored-lesson-registered',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './mentored-lesson-registered.component.html',
  styleUrls: ['./mentored-lesson-registered.component.css'],
})
export class MentoredLessonRegisteredComponent implements OnInit {
  lessons: LessonListResponse[] = [];
  loading = false;

  constructor(
    private lessonService: LessonService,
    private userService: UserService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRegisteredLessons();
  }

  loadRegisteredLessons() {
    this.loading = true;
    this.lessonService
      .findAllRegisteredLessonsByMentored(this.userService.getId())
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.lessons = data.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            if (dateA !== dateB) {
              return dateA - dateB;
            }

            const startA = a.startTime.localeCompare(b.startTime);
            if (startA !== 0) {
              return startA;
            }

            return a.endTime.localeCompare(b.endTime);
          });
          this.loading = false;
        },
        error: () => {
          this.toast.error('Erro ao carregar suas aulas cadastradas.');
          this.loading = false;
        },
      });
  }

  openLessonDetails(id: string) {
    this.router.navigate([`/mentored/lesson/details/${id}`]);
  }

  goBack() {
    this.router.navigate(['/mentored/lesson']);
  }
}

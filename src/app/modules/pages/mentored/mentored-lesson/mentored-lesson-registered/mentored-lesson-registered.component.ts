import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { UserService } from '../../../../../@core/services/user/user.service';
import { DateTimeService } from '../../../../../@core/services/datetime/datetime.service';

@Component({
  selector: 'app-mentored-lesson-registered',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './mentored-lesson-registered.component.html',
  styleUrls: ['./mentored-lesson-registered.component.css'],
})
export class MentoredLessonRegisteredComponent implements OnInit {
  lessons: any[] = [];
  filteredLessons: any[] = [];
  loading = false;

  // Filtro de Categoria
  filterCategory: 'all' | 'available' | 'finished' = 'all';

  constructor(
    private lessonService: LessonService,
    private userService: UserService,
    private toast: ToastService,
    private router: Router,
    private dateTimeService: DateTimeService,
  ) {}

  ngOnInit(): void {
    this.loadRegisteredLessons();
  }

  // Carrega as aulas registradas
  loadRegisteredLessons() {
    this.loading = true;

    this.lessonService
      .findAllRegisteredLessonsByMentored(this.userService.getId())
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const now = this.dateTimeService.now();

          const availableLessons = data.filter((lesson) => {
            const lessonEndTime = this.dateTimeService.utcToLocal(
              lesson.date,
              this.dateTimeService.ensureTimeSeconds(lesson.endTime),
            );
            return lessonEndTime >= now;
          });

          const finishedLessons = data.filter((lesson) => {
            const lessonEndTime = this.dateTimeService.utcToLocal(
              lesson.date,
              this.dateTimeService.ensureTimeSeconds(lesson.endTime),
            );
            return lessonEndTime < now;
          });

          const sortByDateTime = (a: any, b: any) => {
            const dateTimeA = this.dateTimeService.utcToLocal(
              a.date,
              this.dateTimeService.ensureTimeSeconds(a.startTime),
            );
            const dateTimeB = this.dateTimeService.utcToLocal(
              b.date,
              this.dateTimeService.ensureTimeSeconds(b.startTime),
            );
            return dateTimeA.getTime() - dateTimeB.getTime();
          };

          this.lessons = [
            ...availableLessons.sort(sortByDateTime),
            ...finishedLessons.sort(sortByDateTime),
          ];

          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.toast.error('Erro ao carregar suas aulas cadastradas.');
          this.loading = false;
        },
      });
  }

  // Aplica filtro de categoria
  applyFilter() {
    if (this.filterCategory === 'available') {
      this.filteredLessons = this.lessons.filter((l) => !this.isLessonFinished(l));
    } else if (this.filterCategory === 'finished') {
      this.filteredLessons = this.lessons.filter((l) => this.isLessonFinished(l));
    } else {
      this.filteredLessons = [...this.lessons];
    }
  }

  isLessonFinished(lesson: any): boolean {
    return this.dateTimeService.isInPast(lesson.date, lesson.endTime);
  }

  formatDate(lesson: any): string {
    if (!lesson?.date || !lesson?.startTime) return '';
    const localDate = this.dateTimeService.utcToLocal(
      lesson.date,
      this.dateTimeService.ensureTimeSeconds(lesson.startTime),
    );
    return this.dateTimeService.formatDateBR(localDate);
  }

  formatStartTime(lesson: any): string {
    if (!lesson?.date || !lesson?.startTime) return '';
    return this.dateTimeService.utcTimeToLocalTime(lesson.date, lesson.startTime);
  }

  formatEndTime(lesson: any): string {
    if (!lesson?.date || !lesson?.endTime) return '';
    return this.dateTimeService.utcTimeToLocalTime(lesson.date, lesson.endTime);
  }

  changeCategory(category: 'all' | 'available' | 'finished') {
    this.filterCategory = category;
    this.applyFilter(); // Atualiza lista imediatamente
  }

  openLessonDetails(id: string) {
    this.router.navigate([`/mentored/lesson/details/${id}`]);
  }

  goBack() {
    this.router.navigate(['/mentored/lesson']);
  }
}

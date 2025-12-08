import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LessonService } from '../../../../@core/services/lesson/lesson.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { LeasonListResponse as LessonListResponse } from '../../../../@core/interfaces/mentor.interface';
import { DateTimeService } from '../../../../@core/services/datetime/datetime.service';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
})
export class LessonListComponent implements OnInit {
  lessons: (LessonListResponse & { status: string })[] = [];
  loading = false;
  rows = 10;

  filterStatus: 'all' | 'finished' | 'pending' = 'all';

  constructor(
    private leasonService: LessonService,
    private router: Router,
    private userService: UserService,
    private dateTimeService: DateTimeService,
  ) {}

  ngOnInit(): void {
    this.loadLeasons();
  }

  loadLeasons() {
    this.loading = true;
    this.leasonService
      .findAllLessonsByMentor(this.userService.getId())
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const now = this.dateTimeService.now();

          this.lessons = data
            .map((lesson) => {
              const lessonEnd = this.dateTimeService.utcToLocal(
                lesson.date,
                this.dateTimeService.ensureTimeSeconds(lesson.endTime),
              );

              const status = lessonEnd < now ? 'Finalizada' : 'Pendente';

              return { ...lesson, status };
            })
            .sort((a, b) => {
              const dateTimeA = this.dateTimeService.utcToLocal(
                a.date,
                this.dateTimeService.ensureTimeSeconds(a.startTime),
              );
              const dateTimeB = this.dateTimeService.utcToLocal(
                b.date,
                this.dateTimeService.ensureTimeSeconds(b.startTime),
              );
              return dateTimeA.getTime() - dateTimeB.getTime();
            });

          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  get filteredLessons() {
    if (this.filterStatus === 'finished') {
      return this.lessons.filter((l) => l.status === 'Finalizada');
    }
    if (this.filterStatus === 'pending') {
      return this.lessons.filter((l) => l.status === 'Pendente');
    }
    return this.lessons;
  }

  formatDate(utcDate: string, utcTime: string): string {
    const localDate = this.dateTimeService.utcToLocal(
      utcDate,
      this.dateTimeService.ensureTimeSeconds(utcTime),
    );
    return this.dateTimeService.formatDateBR(localDate);
  }

  formatTime(utcDate: string, utcTime: string): string {
    return this.dateTimeService.utcTimeToLocalTime(utcDate, utcTime);
  }

  goToCreate() {
    this.router.navigate(['/mentor/lesson/create-leason']);
  }

  showDetails(leasonId: string) {
    this.router.navigate([`/mentor/lesson/details/${leasonId}`]);
  }
}

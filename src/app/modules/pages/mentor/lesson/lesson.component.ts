import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LessonService } from '../../../../@core/services/lesson/lesson.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { LeasonListResponse as LessonListResponse } from '../../../../@core/interfaces/mentor.interface';

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
          const now = new Date();

          this.lessons = data
            .map((lesson) => {
              const lessonEnd = new Date(`${lesson.date}T${lesson.endTime}`);

              const status = lessonEnd < now ? 'Finalizada' : 'Pendente';

              return { ...lesson, status };
            })
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              if (dateA !== dateB) return dateA - dateB;

              return a.startTime.localeCompare(b.startTime);
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

  goToCreate() {
    this.router.navigate(['/mentor/lesson/create-leason']);
  }

  showDetails(leasonId: string) {
    this.router.navigate([`/mentor/lesson/details/${leasonId}`]);
  }
}

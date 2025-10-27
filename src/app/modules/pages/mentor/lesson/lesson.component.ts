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
  lessons: LessonListResponse[] = [];
  loading = false;

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
          this.loading = false;
        },
      });
  }

  goToCreate() {
    this.router.navigate(['/mentor/lesson/create-leason']);
  }

  showDetails(leasonId: string) {
    this.router.navigate([`/mentor/lesson/details/${leasonId}`]);
  }
}

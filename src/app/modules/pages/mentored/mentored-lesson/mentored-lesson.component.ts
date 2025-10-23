import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LessonService } from '../../../../@core/services/lesson/lesson.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { LeasonListResponse as LessonListResponse } from '../../../../@core/interfaces/mentor.interface';
import { FilterMentoredLessons } from '../../../../@core/interfaces/lesson.interface';

@Component({
  selector: 'app-mentored-lesson',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mentored-lesson.component.html',
  styleUrls: ['./mentored-lesson.component.css'],
})
export class MentoredLessonComponent implements OnInit {
  lessons: LessonListResponse[] = [];
  loading = false;
  filterForm: FormGroup;
  order: 'asc' | 'desc' = 'desc'; // ordem inicial

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private router: Router,
    private userService: UserService,
  ) {
    this.filterForm = this.fb.group({
      title: [''],
      date: [''],
    });
  }

  ngOnInit(): void {
    this.loadLessons();
  }

  toggleOrder() {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.loadLessons();
  }

  goToMyMeetings() {
    this.router.navigate(['/mentored/my-meetings']);
  }

  loadLessons() {
    this.loading = true;

    const filters: FilterMentoredLessons = {
      title: this.filterForm.get('title')?.value || null,
      date: this.filterForm.get('date')?.value || null,
      order: this.order,
    };

    this.lessonService
      .findAllLessonsByMentored(filters)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.lessons = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  clearFilters() {
    this.filterForm.reset();
    this.order = 'desc';
    this.loadLessons();
  }

  showDetails(lessonId: string) {
    this.router.navigate([`/mentored/lesson/details/${lessonId}`]);
  }
}

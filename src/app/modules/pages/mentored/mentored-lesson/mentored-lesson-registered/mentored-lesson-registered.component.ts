import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { LessonService } from '../../../../../@core/services/lesson/lesson.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { UserService } from '../../../../../@core/services/user/user.service';

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
          const now = new Date();

          const availableLessons = data.filter((lesson) => {
            const lessonEndTime = new Date(`${lesson.date}T${lesson.endTime}`);
            return lessonEndTime >= now;
          });

          const finishedLessons = data.filter((lesson) => {
            const lessonEndTime = new Date(`${lesson.date}T${lesson.endTime}`);
            return lessonEndTime < now;
          });

          this.lessons = [
            ...availableLessons.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
            ...finishedLessons.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
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
    const now = new Date();
    const end = new Date(`${lesson.date}T${lesson.endTime}`);
    return end < now;
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

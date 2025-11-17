import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { take, forkJoin } from 'rxjs';
import { LessonService } from '../../../../@core/services/lesson/lesson.service';
import { UserService } from '../../../../@core/services/user/user.service';
import {
  LeasonListResponse as LessonListResponse,
  PaginatedLeasonListResponse,
} from '../../../../@core/interfaces/mentor.interface';
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
    FormsModule,
  ],
  templateUrl: './mentored-lesson.component.html',
  styleUrls: ['./mentored-lesson.component.css'],
})
export class MentoredLessonComponent implements OnInit {
  lessons: LessonListResponse[] = [];
  loading = false;
  filterForm: FormGroup;

  page = 1;
  size = 20;
  totalItems = 0;
  totalPages = 1;

  order: 'asc' | 'desc' = 'desc';

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

  // Alterna ordenação
  toggleOrder() {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.loadLessons();
  }

  goToMyMeetings() {
    this.router.navigate(['/mentored/lessons/registered']);
  }

  // 🔥 Carrega lista de aulas
  loadLessons() {
    this.loading = true;

    const filters: FilterMentoredLessons = {
      title: this.filterForm.get('title')?.value || null,
      date: this.filterForm.get('date')?.value || null,
      order: this.order,
      page: this.page - 1, // backend começa em 0
      size: this.size,
    };

    const userId = this.userService.getId();

    forkJoin({
      allLessons: this.lessonService.findAllLessonsByMentored(filters),
      registeredLessons: this.lessonService.findAllRegisteredLessonsByMentored(userId),
    })
      .pipe(take(1))
      .subscribe({
        next: ({ allLessons, registeredLessons }) => {
          const registeredIds = new Set(registeredLessons.map((r) => r.id));

          if (!allLessons) {
            this.lessons = [];
            this.totalItems = 0;
            this.totalPages = 1;
            this.loading = false;
            return;
          }

          // Conteúdo base
          const items = allLessons.content ?? [];

          // Remove aulas já registradas
          this.lessons = items.filter((l) => !registeredIds.has(l.id));

          // Totais
          this.totalItems = allLessons.total ?? items.length;
          this.totalPages = Math.max(
            1,
            allLessons.totalPages ?? Math.ceil(this.totalItems / this.size),
          );

          // Atualiza página exibida (backend retorna currentPage começando em 0)
          this.page =
            (typeof allLessons.currentPage === 'number' ? allLessons.currentPage : this.page - 1) +
            1;

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  // Limpar filtros
  clearFilters() {
    this.filterForm.reset();
    this.order = 'desc';
    this.page = 1;
    this.size = 20;
    this.loadLessons();
  }

  // Abrir detalhes
  showDetails(id: string) {
    this.router.navigate([`/mentored/lesson/details/${id}`]);
  }

  // Paginação
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLessons();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadLessons();
    }
  }

  // Alterar tamanho da página
  changeSize() {
    this.page = 1;
    this.loadLessons();
  }

  // Ir para primeira página
  goToStart() {
    if (this.page !== 1) {
      this.page = 1;
      this.loadLessons();
    }
  }

  // Ir para última página
  goToEnd() {
    if (this.page !== this.totalPages) {
      this.page = this.totalPages;
      this.loadLessons();
    }
  }
}

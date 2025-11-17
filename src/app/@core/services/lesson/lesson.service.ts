import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateLesson,
  LeasonDetailsResponse,
  PaginatedLeasonListResponse,
} from '../../interfaces/mentor.interface';
import { LeasonListResponse } from '../../interfaces/mentor.interface';
import { FilterMentoredLessons } from '../../interfaces/lesson.interface';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly _baseApi = `${environment.BASE_API}/lesson`;

  constructor(private http: HttpClient) {}

  createLeason(body: CreateLesson): Observable<void> {
    return this.http.post<void>(`${this._baseApi}`, body);
  }

  findAllLessonsByMentor(mentorId: string): Observable<LeasonListResponse[]> {
    return this.http.get<LeasonListResponse[]>(`${this._baseApi}/mentor/${mentorId}/lessons`);
  }

  findLessonById(lessonId: string): Observable<LeasonDetailsResponse> {
    return this.http.get<LeasonDetailsResponse>(`${this._baseApi}/${lessonId}`);
  }

  updateLesson(body: CreateLesson, lessonId: string): Observable<void> {
    return this.http.put<void>(`${this._baseApi}/${lessonId}`, body);
  }

  deleteLesson(lessonId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseApi}/${lessonId}`);
  }

  findAllLessonsByMentored(filter: FilterMentoredLessons): Observable<PaginatedLeasonListResponse> {
    let params = new HttpParams();

    if (filter.title) {
      params = params.set('title', filter.title);
    }

    if (filter.date) {
      const formattedDate = new Date(filter.date).toISOString().split('T')[0];
      params = params.set('date', formattedDate);
    }

    if (filter.order) {
      params = params.set('order', filter.order);
    }

    if (filter.page !== null && filter.page !== undefined) {
      params = params.set('page', String(filter.page));
    }

    if (filter.size !== null && filter.size !== undefined) {
      params = params.set('size', String(filter.size));
    }

    return this.http.get<PaginatedLeasonListResponse>(`${this._baseApi}/list-all-lessons`, {
      params,
    });
  }

  registerMentoredInLesson(lessonId: string): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/${lessonId}/register-mentored`, {});
  }

  findAllRegisteredLessonsByMentored(mentoredId: string): Observable<LeasonListResponse[]> {
    return this.http.get<LeasonListResponse[]>(`${this._baseApi}/mentored/${mentoredId}/lessons`);
  }
}

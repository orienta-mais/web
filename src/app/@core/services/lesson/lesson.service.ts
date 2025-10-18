import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateLesson } from '../../interfaces/mentor.interface';
import { LeasonListResponse } from '../../interfaces/mentor.interface';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly _baseApi = `${environment.BASE_API}/lesson`;

  constructor(private http: HttpClient) {}

  createLeason(body: CreateLesson): Observable<void> {
    return this.http.post<void>(`${this._baseApi}`, body);
  }

  findAllLessons(mentorId: string): Observable<LeasonListResponse[]> {
    return this.http.get<LeasonListResponse[]>(`${this._baseApi}/mentor/${mentorId}/lessons`);
  }

  findLessonById(lessonId: string): Observable<LeasonListResponse> {
    return this.http.get<LeasonListResponse>(`${this._baseApi}/${lessonId}`);
  }

  updateLesson(body: CreateLesson, lessonId: string): Observable<void> {
    return this.http.put<void>(`${this._baseApi}/${lessonId}`, body);
  }

  deleteLesson(lessonId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseApi}/${lessonId}`);
  }
}

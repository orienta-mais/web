import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CountLessons,
  CountMentoreds,
  CountMentors,
  CountStateList,
} from '../../interfaces/dashboard.interface';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly _baseApi = `${environment.BASE_API}/stats`;

  constructor(private http: HttpClient) {}

  countMentors(): Observable<CountMentors> {
    return this.http.get<CountMentors>(`${this._baseApi}/count-mentors`);
  }

  countMentoreds(): Observable<CountMentoreds> {
    return this.http.get<CountMentoreds>(`${this._baseApi}/count-mentoreds`);
  }

  countLessons(): Observable<CountLessons> {
    return this.http.get<CountLessons>(`${this._baseApi}/count-lessons`);
  }

  countState(): Observable<CountStateList> {
    return this.http.get<CountStateList>(`${this._baseApi}/count-by-state`);
  }
}

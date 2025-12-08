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
export class AdminService {
  private readonly _baseApi = `${environment.BASE_API}/admin`;

  constructor(private http: HttpClient) {}

  countMentors(): Observable<CountMentors> {
    return this.http.get<CountMentors>(`${this._baseApi}/stats/count-mentors`);
  }

  countMentoreds(): Observable<CountMentoreds> {
    return this.http.get<CountMentoreds>(`${this._baseApi}/stats/count-mentoreds`);
  }

  countLessons(): Observable<CountLessons> {
    return this.http.get<CountLessons>(`${this._baseApi}/stats/count-lessons`);
  }

  countState(): Observable<CountStateList> {
    return this.http.get<CountStateList>(`${this._baseApi}/stats/count-by-state`);
  }

  savePolicy(payload: { type: string; content: string }): Observable<any> {
    return this.http.post<any>(`${this._baseApi}/terms/policy`, payload);
  }
}

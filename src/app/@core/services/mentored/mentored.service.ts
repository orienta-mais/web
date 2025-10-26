import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RegisterMentored } from '../../interfaces/mentored.interface';

@Injectable({ providedIn: 'root' })
export class MentoredService {
  private readonly _baseApi = `${environment.BASE_API}/mentored`;

  constructor(private http: HttpClient) {}

  register(body: RegisterMentored): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/register`, body);
  }

  getProfile(mentoredId: string): Observable<RegisterMentored> {
    return this.http.get<RegisterMentored>(`${this._baseApi}/${mentoredId}`);
  }

  updateProfile(mentoredId: string, body: RegisterMentored): Observable<void> {
    return this.http.put<void>(`${this._baseApi}/${mentoredId}`, body);
  }

  deleteAccount(mentoredId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseApi}/${mentoredId}`);
  }
}

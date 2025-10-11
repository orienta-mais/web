import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateLeason, MentorId } from '../../interfaces/mentor.interface';
import { LeasonListResponse } from '../../interfaces/mentor.interface';

@Injectable({ providedIn: 'root' })
export class LeasonService {
  private readonly _baseApi = `${environment.BASE_API}/mentor/leason`;

  constructor(private http: HttpClient) {}

  createLeason(body: CreateLeason): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/create-leason`, { body });
  }

  findAllLeasons(body: MentorId): Observable<LeasonListResponse[]> {
    return this.http.post<LeasonListResponse[]>(`${this._baseApi}/find-all`, body);
  }
}

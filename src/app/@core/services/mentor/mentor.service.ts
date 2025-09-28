import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RegisterMentor } from '../../interfaces/mentor.interface';
import {
  UuidOfTokenRegisterRequest,
  UuidOfUpdatePasswordRequest,
} from '../../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class MentorService {
  private readonly _baseApi = `${environment.BASE_API}/mentor`;

  constructor(private http: HttpClient) {}

  register(body: RegisterMentor): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/register`, body);
  }

  validateUuidTokenRegister(body: UuidOfTokenRegisterRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/validate-uuid-password-reset`, body);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ConfirmEmailRequest,
  LoginRequest,
  LoginResponse,
  SendValidateEmailRequest,
  UpdatePasswordRequest,
  UuidOfUpdatePasswordRequest,
} from '../../interfaces/auth.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _baseApi = `${environment.BASE_API}/auth`;

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this._baseApi}/login`, body);
  }

  sendValidateEmail(body: SendValidateEmailRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/send-validate-email`, body);
  }

  confirmEmail(body: ConfirmEmailRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/confirm-email`, body);
  }

  updatePassword(body: UpdatePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/update-password`, body);
  }

  validateUUIDPasswordReset(body: UuidOfUpdatePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/validate-uuid-password-reset`, body);
  }
}

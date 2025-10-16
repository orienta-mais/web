import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { ROLE } from '../../enums/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _baseApi = `${environment.BASE_API}`;

  private ACCESS_TOKEN_KEY = 'access_token';
  private REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this._baseApi}/auth/login`, body);
  }

  sendValidateEmail(body: SendValidateEmailRequest, role: ROLE): Observable<void> {
    return this.http.post<void>(
      `${this._baseApi}/${role.toLocaleLowerCase()}/validate-email`,
      body,
    );
  }

  confirmEmail(body: ConfirmEmailRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/confirm-email`, body);
  }

  validateUpdatePassword(body: SendValidateEmailRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/update-password`, body);
  }

  updatePassword(body: UpdatePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/update-password`, body);
  }

  validateUUIDPasswordReset(body: UuidOfUpdatePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/validate-uuid-password-reset`, body);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  saveTokens(tokens: LoginResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  refreshToken() {
    const refresh = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.http.post<LoginResponse>(
      `${this._baseApi}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      },
    );
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

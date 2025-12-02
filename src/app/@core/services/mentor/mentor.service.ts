import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateLesson, RegisterMentor } from '../../interfaces/mentor.interface';
import { UpdatePasswordRequest, UuidOfTokenRegisterRequest } from '../../interfaces/auth.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MentorService {
  private readonly _baseApi = `${environment.BASE_API}/mentor`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  register(body: RegisterMentor): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/register`, body);
  }

  validateUuidTokenRegister(body: UuidOfTokenRegisterRequest): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/validate-uuid-password-reset`, body);
  }

  getProfile(mentorId: string): Observable<RegisterMentor> {
    return this.http.get<RegisterMentor>(`${this._baseApi}/${mentorId}`);
  }

  updateProfile(mentorId: string, body: RegisterMentor): Observable<void> {
    return this.http.put<void>(`${this._baseApi}/${mentorId}`, body);
  }

  deleteAccount(mentorId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseApi}/${mentorId}`);
  }

  updatePassword(body: UpdatePasswordRequest): Observable<void> {
    return this.authService.updatePassword(body);
  }

  getMentorDetails(mentorId: string): Observable<any> {
    return this.http.get<any>(`${this._baseApi}/details/${mentorId}`);
  }
  getFeedbacks(mentorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this._baseApi}/${mentorId}/reviews`);
  }
  sendFeedback(mentorId: string, body: any): Observable<void> {
    return this.http.post<void>(`${this._baseApi}/${mentorId}/feedback`, body);
  }
}

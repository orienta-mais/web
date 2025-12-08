import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PolicyType } from '../../enums/policy.enum';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly _baseApi = `${environment.BASE_API}/terms`;

  constructor(private http: HttpClient) {}

  getContent(type: PolicyType): Observable<any[]> {
    return this.http.get<any[]>(`${this._baseApi}/active/${type}`);
  }
}

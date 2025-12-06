import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PolicyType } from '../../enums/policy.enum';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly _baseApi = `${environment.BASE_API}/policy`;

  constructor(private http: HttpClient) {}

  getContent(type: PolicyType): Observable<string> {
    return this.http.get(`${this._baseApi}/${type}`, { responseType: 'text' });
  }
}

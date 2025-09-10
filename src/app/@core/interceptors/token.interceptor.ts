import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const acessToken = this.auth.accessToken;
    const refreshToken = this.auth.refreshToken;

    let authReq = req;
    if (acessToken) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${acessToken}` } });
    }

    return next.handle(authReq);
  }
}
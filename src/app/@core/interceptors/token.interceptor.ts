import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  const authReq = accessToken
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            authService.saveTokens(tokens);
            const newReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`) });
            return next(newReq);
          }),
          catchError((err) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
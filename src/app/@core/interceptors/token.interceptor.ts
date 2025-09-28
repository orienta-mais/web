import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => Observable<HttpEvent<any>> = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let isRefreshing = false;
  const accessToken = authService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            isRefreshing = false;
            authService.saveTokens(tokens);
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
            });
            return next(newReq);
          }),
          catchError((err) => {
            isRefreshing = false;
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => err);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};

import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, of } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const PUBLIC_API_URLS = ['/terms/active'];

  const isPublic = PUBLIC_API_URLS.some((url) => req.url.includes(url));
  const isRefreshRequest = req.url.includes('/auth/refresh');
  if (isPublic) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();

  let authReq = req;
  if (accessToken && !isRefreshRequest) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (!isRefreshRequest && (error.status === 401 || error.status === 403)) {
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            authService.saveTokens(tokens);

            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
            });

            return next(newReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};

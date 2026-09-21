import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorNotification } from '../services/error-notification';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorNotification = inject(ErrorNotification);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          errorNotification.show(
            401,
            'Tu sesión no es válida o expiró. Vuelve a iniciar sesión.',
          );
        } else if (error.status === 403) {
          errorNotification.show(403, 'No tienes permiso para realizar esta acción.');
          router.navigateByUrl('/sin-permiso');
        }
      }
      return throwError(() => error);
    }),
  );
};

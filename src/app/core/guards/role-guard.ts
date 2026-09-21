import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Rol } from '../models/rol';

export function roleGuard(rol: Rol): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (auth.hasRole(rol)) {
      return true;
    }

    return router.parseUrl('/sin-permiso');
  };
}

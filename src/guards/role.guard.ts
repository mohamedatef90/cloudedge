import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../types';

/**
 * Returns a guard that allows only users whose role is in allowedRoles.
 * Unauthenticated users are redirected to /login; unauthorised users to
 * the dashboard so they land somewhere valid rather than a blank error.
 */
export function roleGuard(allowedRoles: User['role'][]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    const role = auth.user()?.role;
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/app/cloud-edge']);
  };
}

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);


  const user = authService.currentUser();

  const expectedRoles = route.data['roles'] as Array<string>;

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (expectedRoles.includes(user.role)) {
    return true;
  } else {

    router.navigate(['/home']);
    return false;
  }
};

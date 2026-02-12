import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service';


export const LoginRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user) {
    router.navigate(['/home']);
    return false; 
  }
  
  return true;
};
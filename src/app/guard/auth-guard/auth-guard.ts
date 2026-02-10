import { Component, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';
import { MatSnackBar } from '@angular/material/snack-bar';


export const AuthGuard : CanActivateFn = (route, state) =>{
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const user = authService.currentUser();
  const snackBar = inject(MatSnackBar);

  const expectedRoles = route.data['roles'] as Array<string>;

  if (!user) {
    snackBar.open('⚠️ Debes iniciar sesión para acceder a esta sección.', 'Entendido', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });

    router.navigate(['/auth/login']);
    return false;
  }

  if (expectedRoles && !expectedRoles.includes(user.role)) {
    snackBar.open('⛔ No tienes permisos suficientes para ingresar aquí.', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    router.navigate(['/home']);
    return false;
  }

  return true;
};

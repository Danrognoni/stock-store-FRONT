import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authenticationInterceptor } from './services/authentication-interceptor';
import { catchError, of, tap } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
        const authService = inject(AuthenticationService);
        
        return authService.getProfile().pipe(
          tap(user => {
            console.log('Sesión restaurada:', user); 
          }),
          catchError(() => {
            return of(null);
          })
        );
    })
  ]
};

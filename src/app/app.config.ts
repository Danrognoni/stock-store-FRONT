import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authenticationInterceptor } from './services/authentication-interceptor';
import { catchError, lastValueFrom, of, tap } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      const authService = inject(AuthenticationService);
      return lastValueFrom(
        authService.getProfile().pipe(
          catchError(() => of(null))
        )
      );
    })
  ]
};

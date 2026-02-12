import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router'; 
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authenticationInterceptor } from './services/authentication-interceptor';
import { catchError, lastValueFrom, of } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()), 
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZonelessChangeDetection(),
    provideCharts(withDefaultRegisterables()),
    
    provideAppInitializer(() => {
      const authService = inject(AuthenticationService);
      return lastValueFrom(
        authService.getProfile().pipe(
          catchError(() => of(null))
        )
      );
    }),
  
  ]
};
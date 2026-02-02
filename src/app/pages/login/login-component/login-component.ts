import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthenticationService } from '../../../services/authentication-service';
import { AuthenticationRequest } from '../../../models/authentication/authentication-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: AuthenticationRequest = this.loginForm.value;

      this.authService.authenticate(credentials).subscribe({
        next: (userData: any) => {
          if (userData.role === 'USER') {
            this.router.navigate(['/online-store']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: () => alert('Credenciales incorrectas')
      });
    }
  }
}

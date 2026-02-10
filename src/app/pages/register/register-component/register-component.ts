import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Agregamos feedback visual

import { AuthenticationService } from '../../../services/authentication-service';
import { UserRequest } from '../../../models/user/user-request';
import { W } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

 onSubmit() {
    if (this.registerForm.valid) {
      const data: UserRequest = this.registerForm.value;
      this.authService.register(data).subscribe({
        next: () => {

          this.snackBar.open('¡Cuenta creada con éxito!', 'Cerrar', { duration: 3000 });

          this.router.navigate(['/online-store']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al crear cuenta. Intenta con otro email.', 'Cerrar', { duration: 5000 });
        }
      });
    } else {

      this.registerForm.markAllAsTouched();
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthenticationService } from '../../../services/authentication-service';
import { UserRequest } from '../../../models/user/user-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css', // Reusa el CSS del login o crea uno igual
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

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
        next: () => this.router.navigate(['/']),
        error: () => alert('Error en el registro')
      });
    }
  }
}
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../../services/authentication-service';
import { AuthenticationPassword } from '../../../models/authentication/authentication-password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Control de pasos: 0 = Email, 1 = Código, 2 = Nueva Contraseña
  step = signal<number>(0);
  emailSent = signal<string>('');
  verificationToken = signal<string>('');
  isLoading = signal<boolean>(false);

  // Paso 1: Formulario de Email
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Paso 2: Formulario de Código
  codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4)]]
  });

  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  sendEmail() {
    if (this.emailForm.invalid) return;
    
    this.isLoading.set(true);
    const email = this.emailForm.value.email;
    const dto: AuthenticationPassword = { email: email, token: '', password: '' };

    this.authService.forgotPassword(dto).subscribe({
      next: () => {
        this.emailSent.set(email);
        this.step.set(1);
        this.isLoading.set(false);
      },
      error: () => {
        alert('Error: No se pudo enviar el correo o el usuario no existe.');
        this.isLoading.set(false);
      }
    });
  }

  verifyCode() {
    if (this.codeForm.invalid) return;

    this.isLoading.set(true);
    const code = this.codeForm.value.code;
    const email = this.emailSent();
    const dto: AuthenticationPassword = { email: email, token: '', password: '' };

    this.authService.validateCode(dto, code).subscribe({
      next: (res: any) => {
        const token = res.token || res; 
        this.verificationToken.set(token);
        this.step.set(2);
        this.isLoading.set(false);
      },
      error: () => {
        alert('Código incorrecto o expirado.');
        this.isLoading.set(false);
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.isLoading.set(true);
    
    const dto: AuthenticationPassword = {
      email: this.emailSent(),
      token: this.verificationToken(), 
      password: password
    };

    this.authService.changeForgottenPassword(dto).subscribe({
      next: () => {
        alert('¡Contraseña actualizada con éxito!');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        alert('Error al actualizar la contraseña. Intente nuevamente.');
        this.isLoading.set(false);
      }
    });
  }
}
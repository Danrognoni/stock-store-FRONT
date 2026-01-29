import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  step = signal<number>(0);
  emailSent = signal<string>('');
  verificationToken = signal<string>('');

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]]
  });

  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  sendEmail() {
    if (this.emailForm.invalid) return;
    const email = this.emailForm.value.email;
    
    this.authService.forgotPassword({ email: email, token: '', password: '' }).subscribe({
      next: (res) => {
        this.emailSent.set(email);
        this.step.set(1); 
      },
      error: (err) => alert('Error al enviar correo o correo no existe')
    });
  }

  verifyCode() {
    if (this.codeForm.invalid) return;
    const code = this.codeForm.value.code;
    const email = this.emailSent();

    this.authService.validateCode({ email: email, token: '', password: '' }, code).subscribe({
      next: (res: any) => { 

        this.verificationToken.set(res); 
        this.step.set(2);
      },
      error: (err) => alert('Código incorrecto')
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const dto = {
      email: this.emailSent(),
      token: this.verificationToken(),
      password: this.passwordForm.value.password
    };

    this.authService.changeForgottenPassword(dto).subscribe({
      next: () => {
        alert('Contraseña cambiada con éxito');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => alert('No se pudo cambiar la contraseña')
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {
  private authService = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: [{value: '', disabled: true}],
    role: [{value: '', disabled: true}]
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          lastname: user.lastname,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role
        });
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.snackBar.open('Error al cargar datos del perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const updateData = this.profileForm.getRawValue();

      this.authService.updateUser(updateData).subscribe({
        next: () => {
          this.snackBar.open('¡Perfil actualizado correctamente!', 'Cerrar', { duration: 3000 });
          this.loadProfile();

          const currentUser = this.authService.currentUser();

          if (currentUser?.role === 'USER') {
            this.router.navigate(['/online-store']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error('Error actualizando', err);
          this.snackBar.open('No se pudo actualizar el perfil', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}

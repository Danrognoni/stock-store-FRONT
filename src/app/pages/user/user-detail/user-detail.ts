import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Toast } from '../../category/category-form-component/category-form-component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
     MatIconModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {
  private authService = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  notification = signal<Toast | null>(null);

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
        this.showToast('Error al cargar datos del perfil', 'error');
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const updateData = this.profileForm.getRawValue();

      this.authService.updateUser(updateData).subscribe({
        next: () => {
          this.showToast('¡Perfil actualizado correctamente!', 'success');
          this.loadProfile();

          const currentUser = this.authService.currentUser();

          setTimeout(() => {
            if (currentUser?.role === 'USER') {
              this.router.navigate(['/online-store']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 1000);
        },
        error: (err) => {
          console.error('Error actualizando', err);
          this.showToast('No se pudo actualizar el perfil', 'error');
        }
      });
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }
}
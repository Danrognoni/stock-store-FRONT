import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication-service';
import { Toast } from '../../category/category-form-component/category-form-component';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './user-update.html',
  styleUrl: './user-update.css',
})
export class UserUpdate implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  form: FormGroup;
  userId: string | null = null;
  loading = false;
  notification = signal<Toast | null>(null);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phoneNumber: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.showToast('No se especificó un ID de usuario', 'error');
      setTimeout(() => this.router.navigate(['/admin']), 1000);
    }
  }

  loadUser(id: string) {
    this.loading = true;
    this.authService.getUserById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.showToast('Error al cargar el usuario', 'error');
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin']), 1000);
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.userId) {
      this.loading = true;

      const updateData = this.form.getRawValue();

      this.authService.updateUserAsAdmin(this.userId, updateData).subscribe({
        next: () => {
          this.showToast('Usuario actualizado correctamente', 'success');
          setTimeout(() => this.router.navigate(['/admin']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.showToast('Error al guardar los cambios', 'error');
          this.loading = false;
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
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication-service';

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
    MatSnackBarModule,
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
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  userId: string | null = null;
  loading = false;

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
      this.showError('No se especificó un ID de usuario');
      this.router.navigate(['/admin']);
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
        this.showError('Error al cargar el usuario');
        this.loading = false;
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.userId) {
      this.loading = true;

      const updateData = this.form.getRawValue();

      this.authService.updateUserAsAdmin(this.userId, updateData).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error(err);
          this.showError('Error al guardar los cambios');
          this.loading = false;
        }
      });
    }
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}

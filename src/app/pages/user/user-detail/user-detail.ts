import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthenticationService } from '../../../services/authentication-service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {

  private authService = inject(AuthenticationService);

  user = signal<any>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userStr = localStorage.getItem('user_data');

    if (userStr) {
      const localUser = JSON.parse(userStr);
      const email = localUser.email;

      if (email) {
        this.authService.getUsersByEmail(email).subscribe({
          next: (data) => {
            this.user.set(data);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error cargando perfil', err);
            this.loading.set(false);
          }
        });
      } else {
        this.loading.set(false);
      }
    } else {
      this.loading.set(false);
    }
  }
}

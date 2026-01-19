import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { NavItem } from '../../../models/nav-item';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication-service';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, MatButtonModule, MatDividerModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  items = input.required<NavItem[]>();
  public authService = inject(AuthenticationService);
  private router = inject(Router);

  // 2. Método para cerrar sesión
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}

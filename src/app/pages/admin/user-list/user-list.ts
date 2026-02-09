import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication-service';
import { UserDet } from '../../../models/user/user-det';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private authService = inject(AuthenticationService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  users = signal<UserDet[]>([]);
  loading = signal<boolean>(false);

  filterControl = new FormControl('all');
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadUsers();
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.trim() === '') {
          return this.fetchUsersByFilter(this.filterControl.value || 'all');
        }
        this.loading.set(true);
        return this.authService.getUsersByEmail(term).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.users.set(Array.isArray(response) ? response : (response ? [response] : []));
      },
      error: () => {
        this.loading.set(false);
        this.users.set([]);
      }
    });
  }

  onFilterChange() {
    this.searchControl.setValue('', { emitEvent: false });
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.fetchUsersByFilter(this.filterControl.value || 'all').subscribe({
      next: (data) => {
        this.users.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.showSnackBar('Error al cargar usuarios');
      }
    });
  }

  private fetchUsersByFilter(filter: string) {
    switch (filter) {
      case 'employees':
        return this.authService.listEmployees();
      case 'banned':
        return this.authService.listBannedUsers();
      case 'all':
      default:
        return this.authService.listUsers();
    }
  }

  toggleBan(user: UserDet) {
    const action = user.banned ? 'desbanear' : 'banear';
    if (!confirm(`¿Estás seguro de que deseas ${action} a ${user.email}?`)) return;

    this.authService.toggleBan(user.id).subscribe({
      next: () => {
        this.showSnackBar(`Usuario ${user.banned ? 'desbaneado' : 'baneado'} correctamente`);
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al cambiar estado de baneo')
    });
  }

  promoteToEmployee(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email} a Empleado?`)) return;

    this.authService.promoteToEmployee(user.id).subscribe({
      next: () => {
        this.showSnackBar('Usuario ascendido a Empleado');
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al ascender usuario')
    });
  }

  promoteToAdmin(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email} a Administrador?`)) return;

    this.authService.promoteToAdmin(user.id).subscribe({
      next: () => {
        this.showSnackBar('Usuario ascendido a Administrador');
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al ascender usuario')
    });
  }

  private refreshCurrentView() {
    if (this.searchControl.value) {
       this.loading.set(true);
       this.authService.getUsersByEmail(this.searchControl.value).subscribe({
         next: (res) => {
           this.users.set(Array.isArray(res) ? res : (res ? [res] : []));
           this.loading.set(false);
         },
         error: () => this.loadUsers()
       });
    } else {
      this.loadUsers();
    }
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  editUser(user: any) {
    this.router.navigate(['home/user/update', user.id]);
  }
}

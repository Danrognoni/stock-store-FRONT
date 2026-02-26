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
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication-service';
import { UserDet } from '../../../models/user/user-det';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

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
    MatTooltipModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  users = signal<UserDet[]>([]);
  loading = signal<boolean>(false);
  notification = signal<Toast | null>(null);

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
        const searchTerm = term ? term.trim() : '';
        this.loading.set(true);
        if (!searchTerm) {
          const currentFilter = this.filterControl.value || 'all';
          return this.fetchUsersByFilter(currentFilter).pipe(
            map((data: any) => data?.content || []),
            catchError(err => {
              console.error('Error cargando filtro:', err);
              return of([]); 
            })
          );
        }

        console.log('Buscando:', searchTerm);
        return this.authService.searchUsersByEmail(searchTerm).pipe(
          tap(res => console.log('Respuesta Backend:', res)),
          map((res: any) => {
            if (res && res.content) return res.content;
            if (Array.isArray(res)) return res;        
            if (res && res.id) return [res];         
            return [];
          }),
          catchError((error) => {
            console.error('Error en búsqueda:', error);
            return of([]); 
          })
        );
      })
    ).subscribe({
      next: (userList: any) => {
        console.log('Actualizando tabla con:', userList);
        this.users.set(userList);
        this.loading.set(false);
      },
      error: (e) => {
        console.error('El buscador murió:', e);
        this.loading.set(false);
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
      next: (data: any) => {
        this.users.set(data?.content || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.showToast('Error al cargar usuarios', 'error');
      }
    });
  }

  private fetchUsersByFilter(filter: string) {
    switch (filter) {
      case 'employees': return this.authService.listEmployees();
      case 'banned': return this.authService.listBannedUsers();
      case 'all': default: return this.authService.listUsers();
    }
  }

  toggleBan(user: UserDet) {
    const action = user.banned ? 'desbanear' : 'banear';
    if (!confirm(`¿Estás seguro de que deseas ${action} a ${user.email}?`)) return;
    
    this.authService.toggleBan(user.id).subscribe({
      next: () => {
        this.showToast(`Usuario ${user.banned ? 'desbaneado' : 'baneado'} correctamente`, 'success');
        this.refreshCurrentView();
      },
      error: () => this.showToast('Error al cambiar estado', 'error')
    });
  }

  promoteToEmployee(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email}?`)) return;
    this.authService.promoteToEmployee(user.id).subscribe({
      next: () => {
        this.showToast('Usuario ascendido a Empleado', 'success');
        this.refreshCurrentView();
      },
      error: () => this.showToast('Error al ascender', 'error')
    });
  }

  promoteToAdmin(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email} a Admin?`)) return;
    this.authService.promoteToAdmin(user.id).subscribe({
      next: () => {
        this.showToast('Usuario ascendido a Administrador', 'success');
        this.refreshCurrentView();
      },
      error: () => this.showToast('Error al ascender', 'error')
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }

  private refreshCurrentView() {
    const currentSearch = this.searchControl.value;
    if (currentSearch && currentSearch.trim()) {
      this.searchControl.setValue(currentSearch);
    } else {
      this.loadUsers();
    }
  }
}
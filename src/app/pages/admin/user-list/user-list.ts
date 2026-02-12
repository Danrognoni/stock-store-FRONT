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
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
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
        const searchTerm = term ? term.trim() : '';
        this.loading.set(true);

        // CASO 1: Buscador vacío (volvemos a cargar el filtro actual)
        if (!searchTerm) {
          const currentFilter = this.filterControl.value || 'all';
          return this.fetchUsersByFilter(currentFilter).pipe(
            map((data: any) => data?.content || []),
            // IMPORTANTE: Si falla el filtro, devolvemos array vacío para no romper el buscador
            catchError(err => {
              console.error('Error cargando filtro:', err);
              return of([]); 
            })
          );
        }

        // CASO 2: Hay texto (Buscamos por email)
        console.log('Buscando:', searchTerm); // DEBUG
        return this.authService.searchUsersByEmail(searchTerm).pipe(
          tap(res => console.log('Respuesta Backend:', res)), // DEBUG: Mira esto en la consola
          map((res: any) => {
            // Lógica para extraer la lista sea cual sea el formato del backend
            if (res && res.content) return res.content; // Es un Page
            if (Array.isArray(res)) return res;         // Es una lista directa
            if (res && res.id) return [res];            // Es un objeto único
            return [];
          }),
          catchError((error) => {
            console.error('Error en búsqueda:', error);
            // IMPORTANTE: Devolvemos observable con array vacío para que el switchMap siga vivo
            return of([]); 
          })
        );
      })
    ).subscribe({
      next: (userList: any) => {
        console.log('Actualizando tabla con:', userList); // DEBUG
        this.users.set(userList);
        this.loading.set(false);
      },
      error: (e) => {
        // Esto solo debería pasar si hay un error catastrófico de código, no de red
        console.error('El buscador murió:', e);
        this.loading.set(false);
      }
    });
  }

  // --- El resto de métodos se mantienen igual ---

  onFilterChange() {
    // Limpiamos el buscador sin emitir evento para no disparar el setupSearch doble
    this.searchControl.setValue('', { emitEvent: false });
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.fetchUsersByFilter(this.filterControl.value || 'all').subscribe({
      next: (data: any) => {
        // Aseguramos que leemos .content si viene paginado
        this.users.set(data?.content || []);
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
        this.showSnackBar(`Usuario ${user.banned ? 'desbaneado' : 'baneado'} correctamente`);
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al cambiar estado')
    });
  }

  promoteToEmployee(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email}?`)) return;
    this.authService.promoteToEmployee(user.id).subscribe({
      next: () => {
        this.showSnackBar('Usuario ascendido a Empleado');
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al ascender')
    });
  }

  promoteToAdmin(user: UserDet) {
    if (!confirm(`¿Ascender a ${user.email} a Admin?`)) return;
    this.authService.promoteToAdmin(user.id).subscribe({
      next: () => {
        this.showSnackBar('Usuario ascendido a Administrador');
        this.refreshCurrentView();
      },
      error: () => this.showSnackBar('Error al ascender')
    });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
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
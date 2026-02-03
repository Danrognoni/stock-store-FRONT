import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { UserRequest } from '../models/user/user-request';
import { AuthenticationRequest } from '../models/authentication/authentication-request';
import { AuthenticationPassword } from '../models/authentication/authentication-password';
import { UserUpdatePass } from '../models/user/user-update-pass';
import { UserUpdate } from '../models/user/user-update';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiUrl = "http://localhost:8080/api/auth";
  private readonly userUrl = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);
  currentUser = signal<any>(null);


  register(data: UserRequest) {
    const url = `${this.apiUrl}/register`;
    return this.http.post<any>(url, data).pipe(
      tap((userResponse) => {
        this.currentUser.set(userResponse);
      })
    );
  }

  authenticate(data: AuthenticationRequest) {
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, data).pipe(
      tap((userResponse) => {
        this.currentUser.set(userResponse);
      })
    );
  }

  logout() {
    const url = `${this.apiUrl}/logout`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        this.currentUser.set(null);
      })
    );
  }

  forgotPassword(data: AuthenticationPassword) {
    const url = `${this.apiUrl}/forgot`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  validateCode(data: AuthenticationPassword, code: string) {
    const url = `${this.apiUrl}/verify/${code}`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  changeForgottenPassword(data: AuthenticationPassword) {
    const url = `${this.apiUrl}/forgot/change`;
    return this.http.patch(url, data, { responseType: 'text' });
  }

  changePassword(data: UserUpdatePass) {
    const url = `${this.apiUrl}/logged/password`;
    return this.http.patch<any>(url, data);
  }

  updateUser(data: UserUpdate) {
    const url = `${this.apiUrl}/logged/user`;
    return this.http.patch<any>(url, data).pipe(
      tap(() => {
        const currentUser = this.currentUser();
        const newUser = { ...currentUser, ...data };
        this.currentUser.set(newUser);
      })
    );
  }

  listUsers() {
    const url = `${this.apiUrl}/admin`;
    return this.http.get<any>(url);
  }

  listBannedUsers() {
    const url = `${this.apiUrl}/admin/banned`;
    return this.http.get<any>(url);
  }

  listEmployees() {
    const url = `${this.apiUrl}/admin/employees`;
    return this.http.get<any>(url);
  }

  getUsersByEmail(email: string) {
    const url = `${this.apiUrl}/admin/user/${email}`;
    return this.http.get<any>(url);
  }

  promoteToEmployee(id: string) {
    const url = `${this.apiUrl}/admin/promote/employee/${id}`;
    return this.http.post<any>(url, "");
  }

  promoteToAdmin(id: string) {
    const url = `${this.apiUrl}/admin/promote/admin/${id}`;
    return this.http.post<any>(url, "");
  }

  toggleBan(id: string) {
    const url = `${this.apiUrl}/admin/ban/${id}`;
    return this.http.post<any>(url, "");
  }

  getProfile() {
    const url = `${this.apiUrl}/profile`;
    return this.http.get<any>(url).pipe(
      tap((userResponse) => {
        this.currentUser.set(userResponse);
      })
    );
  }

  updateProfile(data: any) {
    return this.http.patch(`${this.userUrl}/me`, data, {
      responseType: 'text'
    }).pipe(
      tap(() => {
        this.getProfile().subscribe();
      })
    );
  }
}

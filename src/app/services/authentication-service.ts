import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, effect } from '@angular/core';
import { tap } from 'rxjs';
import { UserRequest } from '../models/user/user-request';
import { AuthenticationRequest } from '../models/authentication/authentication-request';
import { AuthenticationPassword } from '../models/authentication/authentication-password';
import { UserUpdatePass } from '../models/user/user-update-pass';
import { UserUpdate } from '../models/user/user-update';
import { UserDet } from '../models/user/user-det';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiUrl = "http://localhost:8080/api";
  private readonly userUrl = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);
  
  currentUser = signal<any>(this.getUserFromStorage());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  }

  private getUserFromStorage() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  register(data: UserRequest) {
    const url = `${this.apiUrl}/auth/register`;
    return this.http.post<any>(url, data).pipe(
      tap((userResponse) => {
        this.currentUser.set(userResponse);
      })
    );
  }

  authenticate(data: AuthenticationRequest) {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<any>(url, data).pipe(
      tap((userResponse) => {
        this.currentUser.set(userResponse);
      })
    );
  }

  logout() {
    const url = `${this.apiUrl}/auth/logout`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        this.currentUser.set(null);
      })
    );
  }

  forgotPassword(data: AuthenticationPassword) {
    const url = `${this.apiUrl}/auth/forgot`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  validateCode(data: AuthenticationPassword, code: string) {
    const url = `${this.apiUrl}/auth/verify/${code}`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  changeForgottenPassword(data: AuthenticationPassword) {
    const url = `${this.apiUrl}/auth/forgot/change`;
    return this.http.patch(url, data, { responseType: 'text' });
  }

  changePassword(data: UserUpdatePass) {
    const url = `${this.apiUrl}/auth/logged/password`;
    return this.http.patch<any>(url, data);
  }

  updateUser(data: UserUpdate) {
    const url = `${this.apiUrl}/auth/logged/user`;
    return this.http.patch<any>(url, data).pipe(
      tap(() => {
        const currentUser = this.currentUser();
        const newUser = { ...currentUser, ...data };
        this.currentUser.set(newUser);
      })
    );
  }

  listUsers() {
    const url = `${this.apiUrl}/auth/admin`;
    return this.http.get<any>(url);
  }

  listBannedUsers() {
    const url = `${this.apiUrl}/auth/admin/banned`;
    return this.http.get<any>(url);
  }

  listEmployees() {
    const url = `${this.apiUrl}/auth/admin/employees`;
    return this.http.get<any>(url);
  }

  searchUsersByEmail(email: string){
    const url = `${this.apiUrl}/auth/admin/user/email/${email}`;
    return this.http.get<any>(url);
  }

  getUsersByEmail(email: string) {
    const url = `${this.apiUrl}/auth/admin/user/search`;
    let params = new HttpParams().set('email', email);
    return this.http.get<UserDet>(url, { params });
  }

  promoteToEmployee(id: string) {
    const url = `${this.apiUrl}/auth/admin/promote/employee/${id}`;
    return this.http.post<any>(url, "");
  }

  promoteToAdmin(id: string) {
    const url = `${this.apiUrl}/auth/admin/promote/admin/${id}`;
    return this.http.post<any>(url, "");
  }

  toggleBan(id: string) {
    const url = `${this.apiUrl}/auth/admin/ban/${id}`;
    return this.http.post<any>(url, "");
  }

  getProfile() {
    const url = `${this.apiUrl}/auth/profile`;
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

  getUserById(id: string) {
    const url = `${this.apiUrl}/auth/admin/user-by-id/${id}`;
    return this.http.get<any>(url);
  }

  updateUserAsAdmin(id: string, data: UserUpdate) {
    const url = `${this.apiUrl}/auth/admin/user/${id}`;
    return this.http.put<any>(url, data);
  }
}
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
  private http = inject(HttpClient);

  currentUser = signal<any>(this.getUserFromStorage());

  private getUserFromStorage() {
    const userStr = localStorage.getItem('app_session_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  register(data:UserRequest){
    const url = `${this.apiUrl}/register`;
    return this.http.post<any>(url, data);
  }

  authenticate(data:AuthenticationRequest){
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, data).pipe(
      tap(response => {
        this.currentUser.set(response);
        localStorage.setItem('app_session_user', JSON.stringify(response));
      })
    );
  }

  logout(){
    const url = `${this.apiUrl}/logout`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('app_session_user');
      })
    );
  }

  forgotPassword(data:AuthenticationPassword){
    const url = `${this.apiUrl}/forgot`;
    return this.http.post<any>(url, data);
  }

  validateCode(data:AuthenticationPassword, code:string){
    const url = `${this.apiUrl}/verify/${code}`;
    return this.http.post<any>(url, data);
  }

  changeForgottenPassword(data:AuthenticationPassword){
    const url = `${this.apiUrl}/forgot/change`;
    return this.http.patch<any>(url, data);
  }

  changePassword(data:UserUpdatePass){
    const url = `${this.apiUrl}/logged/password`;
    return this.http.patch<any>(url, data);
  }

  updateUser(data:UserUpdate){
    const url = `${this.apiUrl}/logged/user`;
    return this.http.patch<any>(url, data).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUser();
        const newUser = { ...currentUser, ...updatedUser };
        this.currentUser.set(newUser);
        localStorage.setItem('app_session_user', JSON.stringify(newUser));
      })
    );
  }

  listUsers(){
    const url = `${this.apiUrl}/admin`;
    return this.http.get<any>(url);
  }

  listBannedUsers(){
    const url = `${this.apiUrl}/admin/banned`;
    return this.http.get<any>(url);
  }

  listEmployees(){
    const url = `${this.apiUrl}/admin/employees`;
    return this.http.get<any>(url);
  }

  getUsersByEmail(email:string){
    const url = `${this.apiUrl}/admin/user/${email}`;
    return this.http.get<any>(url);
  }

  promoteToEmployee(id:string){
    const url = `${this.apiUrl}/admin/promote/employee/${id}`;
    return this.http.post<any>(url, "");
  }

  promoteToAdmin(id:string){
    const url = `${this.apiUrl}/admin/promote/admin/${id}`;
    return this.http.post<any>(url, "");
  }

  toggleBan(id:string){
    const url = `${this.apiUrl}/admin/ban/${id}`;
    return this.http.post<any>(url, "");
  }
}

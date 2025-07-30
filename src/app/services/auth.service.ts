import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; // For redirection after login/register

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Replace with your actual backend API URL
  private apiUrl = 'http://localhost:3000/api'; // e.g., 'http://localhost:3000/api' or 'https://yourdomain.com/api'

  constructor(private http: HttpClient, private router: Router) { }

  // Method to store token (e.g., in localStorage)
  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Method to get token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setAuthToken(response.token);
          // Store user details if provided by backend (e.g., user ID, name)
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    // Ensure you only send necessary fields, and do NOT send confirmPassword to backend
    const { fullName, email, password, phoneNumber } = userData;
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { fullName, email, password, phoneNumber }).pipe(
      tap(response => {
        // Optionally, if you want to auto-login after register, handle token here
        if (response.token) {
          this.setAuthToken(response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']); // Redirect to home page after logout
  }

  // You might want a method to fetch user details from the stored token/DB
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
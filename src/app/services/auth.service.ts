import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8081/api/utente/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password });
  }

  // Metodo per salvare il token nel localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Metodo per ottenere il token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Metodo per rimuovere il token (logout)
  logout(): void {
    localStorage.removeItem('authToken');
  }
}

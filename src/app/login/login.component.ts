import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        const token = response.token;
        this.authService.setToken(token); // Salva il token
        this.router.navigate(['/shop']);
      },
      error => {
        console.error('Errore di login:', error);
      }
    );
  }
}

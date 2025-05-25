// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessageLogin = '';

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmitLogin(): Promise<void> {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessageLogin = 'Inserisci username/email e password.';
      return;
    }
    const result = await this.authService.loginUser(this.usernameOrEmail, this.password);
    if (result.success) {
      alert(result.message);  //POP-up post login
      // Redirect to Home
      this.router.navigate(['/home']);
    } else {
      this.errorMessageLogin = result.message;
    }
  }
  onSubmit(){}
}

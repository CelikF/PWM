import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessageRegister = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmitRegister(): Promise<void> {
    // Validazione dei campi compilati
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessageRegister = 'Compila tutti i campi.';
      return;
    }
    // Verifica che le due password coincidano
    if (this.password !== this.confirmPassword) {
      this.errorMessageRegister = 'Le password non coincidono.';
      return;
    }
    // Invoca la registrazione passando username, email e password
    const result = await this.authService.registerUser(this.username, this.email, this.password);
    
    // Se la registrazione ha successo, mostra un alert e naviga verso "/home"
    if (result.success) {
      alert(result.message);
      console.log("Registrazione riuscita, ora reindirizzo a /home...");
      this.router.navigate(['/home']);
    } else {
      this.errorMessageRegister = result.message;
      console.log("", result.message);
      this.router.navigate(['/home']);
    }
  }
}

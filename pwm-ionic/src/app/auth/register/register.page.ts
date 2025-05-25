import { Component } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule }     from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IonContent, IonItem, IonLabel, IonButton, IonInput } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonButton, IonLabel, IonItem, IonContent, IonInput,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegisterPage {
  form: FormGroup;
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessageRegister = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
    ) {
    this.form = this.fb.group({
      username:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const {username, email, password, confirmPassword } = this.form.value;

    // Validazione dei campi compilati
    if (!username || !email || !password || !confirmPassword) {
      this.errorMessageRegister = 'Compila tutti i campi.';
      return;
    }
    // Verifica che le due password coincidano
    if (password !== confirmPassword) {
      this.errorMessageRegister = 'Le password non coincidono.';
      return;
    }
    // Invoca la registrazione passando username, email e password
    const result = await this.auth.registerUser(this.username, this.email, this.password);
    
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

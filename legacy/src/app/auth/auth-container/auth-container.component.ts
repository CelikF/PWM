// src/app/auth/auth-container/auth-container.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [CommonModule, HttpClientModule, LoginComponent, RegisterComponent],
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AuthContainerComponent {
  isRegisterActive = false;

  showRegister(): void {
    this.isRegisterActive = true;
  }

  showLogin(): void {
    this.isRegisterActive = false;
  }
}

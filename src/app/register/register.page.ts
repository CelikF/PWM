// src/app/register/register.page.ts
import { Component } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { IonicModule }      from '@ionic/angular';
import { CommonModule }     from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegisterPage {
  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.auth.register(this.form.value).subscribe({
      next: () => {
        // Appena registrato, rimani pulito e reindirizza al login
        this.router.navigate(['/login']);
      },
      error: err => this.errorMsg = err.message
    });

  }
}

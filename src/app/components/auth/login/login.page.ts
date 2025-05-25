import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule }     from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { IonContent, IonButton, IonItem, IonLabel, IonInput } from "@ionic/angular/standalone";
import { toast } from 'ngx-sonner';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonLabel, IonItem, IonButton, IonContent, IonInput,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginPage {
  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.value;
    this.auth.loginUser(email, password).then( ({success, message, user}) => {
      if (success){
        this.router.navigate(['/home']);
        toast.success("Login Successfull");
      } else {
        toast.error("Login failed. Try again.");
      }
      
    });
  }
}

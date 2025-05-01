// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthContainerComponent } from './auth/auth-container/auth-container.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  { path: 'login', component: AuthContainerComponent },
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

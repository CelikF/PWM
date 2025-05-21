import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Route[] = [
  { path: '',        redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'register',loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites/favorites.page').then(m => m.FavoritesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detail/detail.page').then(m => m.DetailPage),
    canActivate: [AuthGuard]
  }
];

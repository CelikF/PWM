import { Routes } from '@angular/router';
import { AgendaComponent } from './event-details/components/agenda/agenda.component';
import { AttendeesComponent } from './event-details/components/attendees/attendees.component';
import { DescriptionComponent } from './event-details/components/description/description.component';
import { NewsComponent } from './event-details/components/news/news.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LoginPage } from './auth/login/login.page';
import { RegisterPage } from './auth/register/register.page';
import { DetailsGuard } from './event-details/guard/details-guard.guard';

export const routes: Routes = [
  { path: 'ed/:eventId', component:EventDetailsComponent, canActivate: [AuthGuard, DetailsGuard], 
    children:[
      { path: 'description', component: DescriptionComponent, canActivate: [AuthGuard]},
      { path: 'agenda',      component: AgendaComponent, canActivate: [AuthGuard]},
      { path: 'attendees',   component: AttendeesComponent, canActivate: [AuthGuard]},
      { path: 'news',        component: NewsComponent, canActivate: [AuthGuard]},
      // default to description if no child path is provided
      { path: '', redirectTo: 'description', pathMatch: 'full' },
    ],
  },
  { path: 'account', component: AccountComponent,     canActivate: [AuthGuard]  },
  { path: 'login', component: LoginPage},
  { path: 'register', component: RegisterPage},
  { path: 'home', component: HomeComponent,           canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 // { path: '**', redirectTo: 'login' },
  {
    path: 'notifications',
    loadComponent: () => import('./notification/notification-list.component').then(m => m.NotificationListComponent),
    canActivate: [AuthGuard] 
  },
  
  {
    path: 'notifications/:id',
    loadComponent: () => import('./notification/notification-details.component').then(m => m.NotificationDetailsComponent),
    canActivate: [AuthGuard] 
  }
];

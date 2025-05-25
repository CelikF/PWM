import { Routes } from '@angular/router';
import { LoginPage } from './components/auth/login/login.page';
import { RegisterPage } from './components/auth/register/register.page';
import { AgendaComponent } from './components/event-details/components/agenda/agenda.component';
import { AttendeesComponent } from './components/event-details/components/attendees/attendees.component';
import { DescriptionComponent } from './components/event-details/components/description/description.component';
import { NewsComponent } from './components/event-details/components/news/news.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth-guard/auth.guard';
import { DetailsGuard } from './guards/details-guard/details-guard.guard';



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
  { path: 'login', component: LoginPage},
  { path: 'register', component: RegisterPage},
  { path: 'home', component: HomeComponent,           canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 // { path: '**', redirectTo: 'login' },

 {
    path: 'notifications',
    loadComponent: () =>
      import('./notification/notification-list.component').then(
        (m) => m.NotificationListComponent
      ),
    canActivate: [AuthGuard]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' },

  {
  path: 'notification/:id',
  loadComponent: () =>
    import('./notification/notification-details.component').then(m => m.NotificationDetailsComponent),
  canActivate: [AuthGuard] // optional
}


];

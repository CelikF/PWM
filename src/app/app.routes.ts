// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthContainerComponent } from './auth/auth-container/auth-container.component';
import { HomeComponent } from './home/home.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { DescriptionComponent } from './event-details/components/description/description.component';
import { AgendaComponent } from './event-details/components/agenda/agenda.component';
import { AttendeesComponent } from './event-details/components/attendees/attendees.component';
import { NewsComponent } from './event-details/components/news/news.component';

export const routes: Routes = [
  { path: 'ed/:eventId', component:EventDetailsComponent, 
    children:[
      { path: 'description', component: DescriptionComponent },
      { path: 'agenda',      component: AgendaComponent    },
      { path: 'attendees',   component: AttendeesComponent },
      { path: 'news',        component: NewsComponent      },
      // default to description if no child path is provided
      { path: '', redirectTo: 'description', pathMatch: 'full' },
    ]
  },
  { path: 'login', component: AuthContainerComponent },
  { path: 'home', component: HomeComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' },
];

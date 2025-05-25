import { Component, computed, effect, EnvironmentInjector, inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Attendee, DataService, Event } from '../event-details/services/data.service';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService, User } from '../auth/auth.service';
import { FavoritesService } from '../event-details/services/favorite-storage.service';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonToggle, IonIcon, IonCardContent, IonCard } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonCardContent, IonIcon, IonLabel, IonItem, IonContent, IonInput, IonButton, IonToggle, IonCard,
     CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private router = inject(Router);
  private dataService = inject(DataService);
  private authSvc = inject(AuthService);
  private favoritesSvc = inject(FavoritesService);

  searchText: string = '';
  events = this.dataService.events$; // Signal<Event[]>
  selectedDate: string = '';
  showOnlyFavorites = false;
  showOnlyMine = false;

  favoriteEventIds = new Set<string>();
  attendeesCache: Record<string, Attendee[]> = {};

  constructor() {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd && this.router.url.includes('/home')) {
        await this.loadFavorites();
      }
    });

    effect(() => {
      const events = this.events();
      const user = this.authSvc.getCurrentUser();
      if (!events.length || !user) return;

      // Populate attendeesCache once
      Promise.all(events.map(async (event) => {
        const attendees = await this.dataService.getAttendeesOnce(String(event.id));
        this.attendeesCache[String(event.id)] = attendees;
      }));
    });
  }

  async loadFavorites(maxRetries: number = 10, delayMs: number = 300) {
    let retries = 0;
    while (retries < maxRetries) {
      const user = await this.authSvc.getCurrentUser();
      if (user) {
        const favorites = await this.favoritesSvc.getFavorites(user.uid);
        this.favoriteEventIds = new Set(favorites);
        console.log("Favorites loaded:", this.favoriteEventIds);
        return;
      }
      await new Promise(res => setTimeout(res, delayMs));
      retries++;
    }
    console.warn("User not available after retries.");
  }

  // Utility: returns countdown string
  getCountdown(datetime: any): string {
    const now = new Date();
    const eventTime = datetime.toDate(); // Firestore Timestamp → JS Date
    const diffMs = eventTime.getTime() - now.getTime();

    if (diffMs <= 0) return 'Event started';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return days > 0
      ? `Starts in ${days} days`
      : `Starts in ${hours}h ${minutes}m ${seconds}s`;
  }

  // Filtered results based on search
  get filteredEvents() {
  const allEvents = this.events();
      const user = this.authSvc.getCurrentUser();  if (!user) return [];

  return allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(this.searchText.toLowerCase());
    const isFavorite = this.favoriteEventIds.has(String(event.id));
    
    const isAssociated = this.isUserAssociatedWithEvent(event, user.uid, this.attendeesCache);

    return matchesSearch
      && (!this.showOnlyFavorites || isFavorite)
      && isAssociated;
  });
}

  isUserAssociatedWithEvent(event: Event, userId: string, attendeesMap: Record<string, Attendee[]>): boolean {
    if (event.host_id === userId) return true;
    const attendees = attendeesMap[String(event.id)] || [];
    return attendees.some(a => a.id === userId);
  }


  async isUserAttendee(eventId: string, userId: string): Promise<boolean> {
    const attendees = await this.dataService.getAttendeesOnce(eventId);
    console.log(attendees);
    console.log(eventId);
    return attendees.some(a => a.id === userId);
  }


  // Navigate to event details
  goToEvent(id: string | number) {
    this.router.navigate(['/ed', id]);
  }

  createEvent() {
    const uid = this.authSvc.getCurrentUser()?.uid;
    if (!uid) {
      alert("You must be logged in to create an event.");
      return;
    }

    const placeholder = {
      title: 'New Event',
      description: 'Event description goes here.',
      location: 'TBD',
      datetime: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 1 week from now
      host_id: uid
    };

    this.dataService.createEvent(placeholder).then(docRef => {
      const newId = docRef.id;
      this.router.navigate([`/ed/${newId}/description`]);
    }).catch(err => {
      console.error('Error creating event:', err);
    });
  }
}

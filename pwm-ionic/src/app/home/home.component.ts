import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Event } from '../event-details/services/data.service';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService, User } from '../auth/auth.service';
import { IonCardContent, IonButton, IonContent, IonButtons, IonImg, IonToolbar, IonHeader } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { FavoritesService } from '../event-details/services/favorite-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonicModule], // ✅ <-- Include FormsModule here!
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

  favoriteEventIds = new Set<string>();

  async ngOnInit() {
    await this.favoritesSvc.debugLogFavoritesTable();
    await this.loadFavorites();
    
    console.log(this.favoriteEventIds);
    console.log(await this.favoritesSvc.getFavorites('2Dk7zQ3ok3PV9MLHAkpco3UaHun1'))
  }

  constructor() {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd && this.router.url.includes('/home')) {
        await this.loadFavorites();
      }
    });

  // optional: effect to reactively check if user becomes available
  effect(() => {
    const user = this.authSvc.getCurrentUser();
    if (!user) return;
    this.favoritesSvc.getFavorites(user.uid).then(favs => {
      this.favoriteEventIds = new Set(favs);
    });
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
    return this.events().filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(this.searchText.toLowerCase());
      const isFavorite = this.favoriteEventIds.has(String(event.id));
      return matchesSearch && (!this.showOnlyFavorites || isFavorite);
    });
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

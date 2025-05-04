import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Event } from '../event-details/services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private router = inject(Router);
  private dataService = inject(DataService);

  // This is a Signal<Event[]> pulled directly from DataService
  events = this.dataService.events$;

  // Utility: returns countdown string for an event
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

  goToEvent(id: string | number) {
    this.router.navigate(['/ed', id]);
  }
}

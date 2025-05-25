import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Event } from '../event-details/services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ✅ <-- Include FormsModule here!
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private router = inject(Router);
  private dataService = inject(DataService);

  searchText: string = '';
  events = this.dataService.events$; // Signal<Event[]>
  selectedDate: string = '';
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
    return this.events().filter(event =>
      event.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  goToEvent(id: string | number) {
    this.router.navigate(['/ed', id]);
  }
}

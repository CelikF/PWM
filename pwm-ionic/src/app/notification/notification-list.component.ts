// notification-list.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notification.service';
import { NotificationCardComponent } from './notification-card.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications = inject(NotificationService).notifications$;
  private router = inject(Router);

  viewNotification(id: string): void {
    this.router.navigate(['/notifications', id]);
  }
}

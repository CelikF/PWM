import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { NotificationCardComponent } from './notification-card.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const signal = this.notifService.notifications$;
    this.notifications = signal(); // ✅ call signal to get value once
  }

  viewNotification(id: string): void {
    this.router.navigate(['/notifications', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notifService: NotificationService, private router: Router) {}

  ngOnInit() {
    this.notifService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  viewNotification(id: string) {
    this.router.navigate(['/notifications', id]);
  }
}

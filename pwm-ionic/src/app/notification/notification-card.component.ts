import { Component, Input } from '@angular/core';
import { Notification } from './notification.model';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule], // ✅ Include it here
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
  @Input() notification!: Notification;
}

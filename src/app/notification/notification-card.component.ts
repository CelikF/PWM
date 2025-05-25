import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from './notification.model';

import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon
  ],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
  @Input() notification!: Notification;
  @Output() delete = new EventEmitter<string>();
}

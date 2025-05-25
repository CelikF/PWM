import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Firestore, deleteDoc, doc } from '@angular/fire/firestore';
import { toast } from 'ngx-sonner';

import { NotificationService } from './notification.service';
import { NotificationCardComponent } from './notification-card.component';
import { Notification } from './notification.model';
import { NotificationCreateComponent } from './notification-create.component';

import {
  AlertController,
  ModalController,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItem,
  IonText,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NotificationCardComponent,
    NotificationCreateComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonSearchbar,
    IonList,
    IonItem,
    IonText,
    IonFab,
    IonFabButton,
    IonIcon
  ],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications = inject(NotificationService).notifications$;
  private firestore = inject(Firestore);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  searchText: string = '';

  filteredNotifications(): Notification[] {
    const all = this.notifications();
    if (!this.searchText.trim()) return all;

    return all.filter(n =>
      n.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      n.message.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async confirmDelete(notificationId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Notification',
      message: 'Are you sure you want to delete this notification?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            try {
              await deleteDoc(doc(this.firestore, 'notifications', notificationId));
              toast.success('Notification deleted');
            } catch (err) {
              console.error(err);
              toast.error('Failed to delete notification');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openCreateNotification(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: NotificationCreateComponent
    });

    await modal.present();
  }

  signOut(): void {
    console.log('Sign out clicked');
    // Optional: AuthService.logout()
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonInput, IonButton } from '@ionic/angular/standalone';
import { addDoc, collection, Firestore, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-notification-create',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonButton],
  templateUrl: './notification-create.component.html',
  styleUrls: ['notification-create.component.css']
})
export class NotificationCreateComponent {
  private firestore = inject(Firestore);
  private modalCtrl = inject(ModalController);

  senderName = '';
  senderEmail = '';
  title = '';
  message = '';

  async createNotification() {
    const notification = {
      senderName: this.senderName,
      senderEmail: this.senderEmail,
      title: this.title,
      message: this.message,
      date: serverTimestamp()
    };

    await addDoc(collection(this.firestore, 'notifications'), notification);
    this.modalCtrl.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}

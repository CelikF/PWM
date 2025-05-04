import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Notification } from './notification.model';
import { CollectionReference } from '@firebase/firestore-types';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private firestore: Firestore = inject(Firestore);
  private notificationCollection = collection(this.firestore, 'notification') as CollectionReference<Notification>;

  getNotifications(): Observable<Notification[]> {
    return collectionData(this.notificationCollection, { idField: 'id' }) as Observable<Notification[]>;
  }
}

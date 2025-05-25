import { Injectable, inject, Signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification } from './notification.model';  // ✅ Import your model

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private firestore = inject(Firestore);

  private notificationCollection = collection(
    this.firestore,
    'notifications'
  ) as CollectionReference<Notification>;

  notifications$: Signal<Notification[]> = toSignal(
    collectionData(
      this.notificationCollection,
      { idField: 'id' }
    ).pipe(
      tap(data => console.log('📥 Notifications from Firestore:', data))
    ) as Observable<Notification[]>,
    { initialValue: [] }
  );
}


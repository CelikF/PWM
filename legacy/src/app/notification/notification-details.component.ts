import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { docData, doc, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css']
})
export class NotificationDetailsComponent implements OnInit {
  notification?: Notification;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const ref = doc(this.firestore, `notification/${id}`);
      docData(ref, { idField: 'id' }).subscribe(data => {
        this.notification = data as Notification;
      });
    }
  }
}
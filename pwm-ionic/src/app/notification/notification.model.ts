import { Timestamp } from '@angular/fire/firestore';

export interface Notification {
  id: string;
  title: string;
  message: string;
  senderName: string;
  senderEmail: string;
  date: Timestamp; // ✅ not Date
}

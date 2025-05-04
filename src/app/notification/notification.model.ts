export interface Notification {
    id: string;
    title: string;
    message: string;
    senderName: string;
    senderEmail: string;
    date: Date; // or `Date` if you parse Firestore's timestamp
  }
  
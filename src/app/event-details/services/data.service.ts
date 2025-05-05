import { Injectable, inject, Signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  CollectionReference,
  Timestamp,
  setDoc
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';

// Interfaces matching Firestore structure
export interface Attendee {
  id: string;
  user_id?: string;
  status: string;
}

export interface Activity {
  id: string;
  activity_name: string;
  start_time: string;
  end_time: string;
}

export interface NewsItem {
  id: number;
  event_id: number;
  image?: string;
  title: string;
  description: string;
  content?: string;
}

export interface Event {
  id: number;
  image: string;
  host_id: string;
  title: string;
  location: string;
  datetime: Timestamp;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private fs = inject(Firestore);
  private eventsCol = collection(this.fs, 'events') as CollectionReference<Event>;

  currentEvent!: Event;


  //Stream of all events, ordered by datetime.
  events$: Signal<Event[]> = toSignal(
    collectionData(
      query(this.eventsCol, orderBy('datetime')),
      { idField: 'id' }
    ) as Observable<Event[]>,
    { initialValue: [] }
  );

  // Single event by ID.
  event(id: any) {
    const d = doc(this.fs, 'events', id);
    return toSignal(
      docData(d, { idField: 'id' }) as Observable<Event>,
      { initialValue: undefined }
    );
  }

  // --- Events CRUD ---
  createEvent(data: Omit<Event, 'id'>) {
    return addDoc(this.eventsCol, data);
  }

  updateEvent(id: string, data: Partial<Event>) {
    const d = doc(this.fs, 'events', id);
    console.log("Updating event" + id + "with" + data);
    return updateDoc(d, data as any);
  }

  deleteEvent(id: string) {
    const d = doc(this.fs, 'events', id);
    return deleteDoc(d);
  }

  // --- Attendees sub-collection ---
  attendees$(eventId: string): Signal<Attendee[]> {
    const col = collection(this.fs, `events/${eventId}/attendees`);
    return toSignal(
      collectionData(col, { idField: 'id' }) as Observable<Attendee[]>,
      { initialValue: [] }
    );
    //return toSignal(collectionData(col) as Observable<Attendee[]>, { initialValue: [] });
  }

  addAttendee(eventId: string, attendee: Attendee) {
    const customRef = doc(this.fs, `events/${eventId}/attendees`, attendee.id);
    return setDoc(customRef, attendee);
  }

  updateAttendee(eventId: string, userId: string, data: Partial<Attendee>) {
    const d = doc(this.fs, `events/${eventId}/attendees/${userId}`);
    return updateDoc(d, data as any);
  }

  deleteAttendee(eventId: string, userId: string) {
    const d = doc(this.fs, `events/${eventId}/attendees/${userId}`);
    return deleteDoc(d);
  }

  // --- Activities sub-collection ---
  activities$(eventId: string): Signal<Activity[]> {
    const col = collection(this.fs, `events/${eventId}/activities`) as CollectionReference<Activity>;
    const q   = query(col, orderBy('start_time'));
    return toSignal(
      collectionData(q, { idField: 'id' }) as Observable<Activity[]>,
      { initialValue: [] }
    );
  }

  activity(
    eventId: string,
    activityId: string
  ){
    // build a reference to /events/{eventId}/activities/{activityId}
    const ref = doc(this.fs, `events/${eventId}/activities/${activityId}`);
    return docData(ref, { idField: 'id' }) as Observable<Activity | undefined>
  }

  addActivity(eventId: string, activity: Activity) {
    const col = collection(this.fs, `events/${eventId}/activities`);
    return addDoc(col, activity);
  }

  updateActivity(eventId: string, activityId: string, data: Partial<Activity>) {
    const d = doc(this.fs, `events/${eventId}/activities/${activityId}`);
    return updateDoc(d, data as any);
  }

  deleteActivity(eventId: string, activityId: string) {
    const d = doc(this.fs, `events/${eventId}/activities/${activityId}`);
    return deleteDoc(d);
  }

  // --- News sub-collection ---
  news$(eventId: string): Signal<NewsItem[]> {
    const col = collection(this.fs, `events/${eventId}/news`);
    return toSignal((collectionData(col,{ idField: 'id' })) as Observable<NewsItem[]>, { initialValue: [] });
  }

  newsitem(eventId: string, newsId: string): Observable<NewsItem | undefined> {
    const ref = doc(this.fs, `events/${eventId}/news/${newsId}`);
    return docData(ref, { idField: 'id' }) as Observable<NewsItem | undefined>
  }

  addNews(eventId: string, news: NewsItem) {
    const col = collection(this.fs, `events/${eventId}/news`);
    return addDoc(col, news);
  }

  updateNews(eventId: string, newsId: string, data: Partial<NewsItem>) {
    const d = doc(this.fs, `events/${eventId}/news/${newsId}`);
    return updateDoc(d, data as any);
  }

  deleteNews(eventId: string, newsId: string) {
    const d = doc(this.fs, `events/${eventId}/news/${newsId}`);
    return deleteDoc(d);
  }
}

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  // registra l’utente in Auth e salva i dati in Firestore
  register(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<void> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    ).pipe(
      switchMap(cred => {
        const uid = cred.user!.uid;
        const data: User = {
          uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
        return from(this.afs.collection('users').doc(uid).set(data));
      })
    );
  }

  // login con email/password
  login(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  // utente autenticato, con dati da Firestore
  get user$(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      switchMap(u => {
        if (!u) {
          return of(null);
        }
        return this.afs.doc<User>(`users/${u.uid}`)
          .valueChanges()
          .pipe(
            // se il doc non esiste, valueChanges restituisce undefined → lo trasformiamo in null
            map(userData => userData ?? null)
          );
      })
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}

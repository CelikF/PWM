import { Injectable, inject, EnvironmentInjector, runInInjectionContext, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Import per Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, getDocs, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions'
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string; // non utilizzata in firebase
  created_events?: number[];
  attending_events?: { [key: string]: string };
}

export interface Database {
  users: User[];
  events: any[];
  news: any[];
  notifications: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Catturiamo l'injector tramite un field initializer per garantire un contesto valido
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  
  // IMPORANTE: Imposta true per utilizzare Firebase, false per usare JSON/LocalStorage
  private useFirebase: boolean = true; 
  private dbKey = 'database';
  private dbUrl = '/db.json';
  private database: Database | null = null;
  private functions!: Functions;

  constructor(
    private http: HttpClient,
    //private afAuth: AngularFireAuth,
    private auth: Auth,
    //private afs: AngularFirestore,
    private fs: Firestore,
  ) {
    if (!this.useFirebase) {
      this.loadDatabase();
    }
    runInInjectionContext(this.injector, () => {
       this.functions = inject(Functions);
    })
  }

  // Carica il database dal LocalStorage o dal file JSON
  private loadDatabase(): void {
    const storedDB = localStorage.getItem(this.dbKey);
    if (storedDB) {
      this.database = JSON.parse(storedDB);
      console.log('Database caricato da localStorage:', this.database);
    } else {
      this.http.get<Database>(this.dbUrl).pipe(
        tap(db => {
          this.database = db;
          localStorage.setItem(this.dbKey, JSON.stringify(db));
          console.log('Database caricato dal JSON:', this.database);
        }),
        catchError(err => {
          console.error('Impossibile caricare il database', err);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Login
  loginUser(usernameOrEmail: string, password: string): Promise<{ success: boolean, message: string, user?: any }> {
    return signInWithEmailAndPassword(this.auth, usernameOrEmail, password)
      .then(credential => {
        if (credential.user) {
          return { success: true, message: 'Login avvenuto con successo.', user: credential.user };
        } else {
          return { success: false, message: 'Errore: nessun utente restituito.' };
        }
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          return { success: false, message: 'Formato email non valido.' };
        } else {
          return { success: false, message: error.message };
        }
      });
  }

  // Registrazione
  registerUser(username: string, email: string, password: string, role: string = 'User'): Promise<{ success: boolean, message: string, user?: any }> {
    return runInInjectionContext(this.injector, async () => {
      try {
        const usersRef = collection(this.fs, 'users');
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          return { success: false, message: 'Email già in uso.' };
        }

        const credential = await createUserWithEmailAndPassword(this.auth, email, password);

        if (!credential.user) {
          return { success: false, message: 'Errore durante la creazione dell\'utente.' };
        }

        const newUser: User = {
          id: credential.user.uid, // correct: match Auth UID
          username,
          email,
          created_events: [],
          attending_events: {}
        };

        // ✅ ONLY this line should remain — no random document
        await setDoc(doc(this.fs, 'users', credential.user.uid), newUser);

        return { success: true, message: 'Registrazione avvenuta con successo.', user: newUser };

      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          return { success: false, message: 'L\'email è già in uso.' };
        } else if (error.code === 'auth/invalid-email') {
          return { success: false, message: 'Formato email non valido.' };
        } else {
          return { success: false, message: error.message };
        }
      }
    });
  }

  getUserData(uid: string): Promise<User> {
    if (this.useFirebase) {
      const userDocRef = doc(this.fs, 'users', uid);
      return getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          return docSnap.data() as User;
        } else {
          throw new Error('Utente non trovato');
        }
      });
    } else {
      // Simulazione per il database JSON/LocalStorage
      if (!this.database) {
        return Promise.reject('Database non caricato');
      }
      const user = this.database.users.find(u => u.id === uid);
      if (!user) {
        return Promise.reject('Utente non trovato');
      }
      return Promise.resolve(user);
    }
  }
  

  getCurrentUser(){
    return this.auth.currentUser;
  }

  // getEmailsForUids(uids: string[]){
  //   // Prepare callable function reference (Cloud Function must be deployed separately)
  //   const getEmailsFn = httpsCallable<{ uids: string[] }, Record<string, string>>(
  //     this.functions, 
  //     'getEmailsByUIDs'
  //   );
  //   // Call the function and return the Observable of its result data
  //   getEmailsFn({ uids }).then(res => {return console.log(res)});
  // }

  getUsers(){
    const col = collection(this.fs, `users`) as CollectionReference<User>;
    return toSignal(
      collectionData(col, { idField: 'id' }) as Observable<User[]>,
      { initialValue: [] }
    );
  }

  async hostLoggedIn(event: any){
    if (this.getCurrentUser() === undefined ||
        event === undefined){
        return false;
      }
    return this.getCurrentUser()?.uid === event.host_id;
  }

}


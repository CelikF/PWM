import { Injectable, inject, EnvironmentInjector, runInInjectionContext, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Import per Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions'
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

export interface User {
  id?: number;       // utilizzato per JSON
  uid?: string;      // utilizzato per Firebase
  image: string;
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
    private afAuth: AngularFireAuth,
    private auth: Auth,
    private afs: AngularFirestore,
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
    if (this.useFirebase) {
      return this.afAuth.signInWithEmailAndPassword(usernameOrEmail, password)
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
    } else {
      return new Promise(resolve => {
        if (!this.database) {
          resolve({ success: false, message: 'Database non caricato.' });
          return;
        }
        if (!usernameOrEmail || !password) {
          resolve({ success: false, message: 'Inserisci username/email e password.' });
          return;
        }
        const user = this.database.users.find(u =>
          u.username === usernameOrEmail || u.email === usernameOrEmail
        );
        if (!user) {
          resolve({ success: false, message: 'Utente non trovato.' });
        } else if (user.password !== password) {
          resolve({ success: false, message: 'Password errata.' });
        } else {
          resolve({ success: true, message: 'Login avvenuto con successo.', user });
        }
      });
    }
  }

  // Registrazione
  registerUser(username: string, email: string, password: string, role: string = 'User'): Promise<{ success: boolean, message: string, user?: any }> {
    if (this.useFirebase) {
      // Eseguiamo il codice in un contesto di injection valido usando runInInjectionContext
      return runInInjectionContext(this.injector, () => {
        return this.afs.collection<User>('users', ref => ref.where('email', '==', email))
          .get()
          .toPromise()
          .then(snapshot => {
            if (snapshot && !snapshot.empty) {
              return { success: false, message: 'Email già in uso.' };
            } else {
              return this.afAuth.createUserWithEmailAndPassword(email, password)
                .then(credential => {
                  if (credential.user) {
                    const newUser: User = {
                      uid: credential.user.uid,
                      username: username,
                      email: email,
                      image: 'https://example.com/images/default.jpg',
                      created_events: [],
                      attending_events: {}
                    };
                    addDoc(collection(this.fs, 'users'), newUser);
                    return this.afs.collection('users').doc(credential.user.uid).set(newUser)
                      .then(() => {
                        return { success: true, message: 'Registrazione avvenuta con successo.', user: newUser };
                      })
                      .catch(err => ({ success: false, message: err.message }));
                  } else {
                    return { success: false, message: 'Errore durante la creazione dell\'utente.' };
                  }
                })
                .catch(error => {
                  if (error.code === 'auth/email-already-in-use') {
                    return { success: false, message: 'L\'email è già in uso.' };
                  } else if (error.code === 'auth/invalid-email') {
                    return { success: false, message: 'Formato email non valido.' };
                  } else {
                    return { success: false, message: error.message };
                  }
                });
            }
          })
          .catch(error => {
            return { success: false, message: error.message };
          });
      });
    } else {
      return new Promise(resolve => {
        if (!this.database) {
          resolve({ success: false, message: 'Database non caricato.' });
          return;
        }
        const userExists = this.database.users.some(u =>
          u.username === username || u.email === email
        );
        if (userExists) {
          resolve({ success: false, message: 'Username o email già esistente.' });
          return;
        }
        const newId = this.database.users.length > 0
          ? Math.max(...this.database.users.map(u => u.id ?? 0)) + 1
          : 1;
        const newUser: User = {
          id: newId,
          image: 'https://example.com/images/default.jpg',
          username,
          email,
          password, // In produzione è consigliato criptare la password
          created_events: [],
          attending_events: {}
        };
        this.database.users.push(newUser);
        localStorage.setItem(this.dbKey, JSON.stringify(this.database));
        resolve({ success: true, message: 'Registrazione avvenuta con successo.', user: newUser });
      });
    }
  }
  getUserData(uid: string): Promise<User> {
    if (this.useFirebase) {
      return this.afs.collection('users').doc(uid).get().toPromise().then(doc => {
        if (doc?.exists) {
          return doc.data() as User; // Restituisce i dati dell'utente
        } else {
          throw new Error('Utente non trovato');
        }
      });
    } else {
      // Simulazione per il database JSON/LocalStorage
      if (!this.database) {
        return Promise.reject('Database non caricato');
      }
      const user = this.database.users.find(u => u.uid === uid);
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


}


// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import for AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      AngularFirestoreModule
    ), provideFirebaseApp(() => initializeApp({ projectId: "pvvm-87506", appId: "1:515391006887:web:a6d643bb18c701dd041382", storageBucket: "pvvm-87506.firebasestorage.app", apiKey: "AIzaSyCPfpwBLCgMi0BHb-JTWuvkoVAVpQVYaDI", authDomain: "pvvm-87506.firebaseapp.com", messagingSenderId: "515391006887" })), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({ projectId: "pvvm-87506", appId: "1:515391006887:web:a6d643bb18c701dd041382", storageBucket: "pvvm-87506.firebasestorage.app", apiKey: "AIzaSyCPfpwBLCgMi0BHb-JTWuvkoVAVpQVYaDI", authDomain: "pvvm-87506.firebaseapp.com", messagingSenderId: "515391006887" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())
  ]
}).catch(err => console.error(err));

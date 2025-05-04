import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { } from '@angular/fire'

import { AngularFireModule } from '@angular/fire/compat';
 import { AngularFireAuthModule } from '@angular/fire/compat/auth';
 import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyCPfpwBLCgMi0BHb-JTWuvkoVAVpQVYaDI",
        authDomain: "pvvm-87506.firebaseapp.com",
        projectId: "pvvm-87506",
        storageBucket: "pvvm-87506.firebasestorage.app",
        messagingSenderId: "515391006887",
        appId: "1:515391006887:web:a6d643bb18c701dd041382"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase),
       AngularFireAuthModule,
       AngularFirestoreModule
    )
  ],
};

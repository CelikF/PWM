import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { } from '@angular/fire'
import { getAuth, provideAuth } from '@angular/fire/auth';

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
    provideClientHydration(withEventReplay()),
  ],
};

import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environments/environment.prod';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { addIcons } from 'ionicons';
import { closeOutline, ellipsisVertical, heart, imageOutline, sendOutline, trash, trashOutline } from 'ionicons/icons';
import { heartOutline } from 'ionicons/icons';

addIcons({
  'heart': heart,
  'heart-outline': heartOutline,
  'send-outline': sendOutline,
  'image-outline': imageOutline,
  'ellipsis-vertical': ellipsisVertical,
  'trash': trash
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'pvvm-87506',
        appId: '1:515391006887:web:a6d643bb18c701dd041382',
        storageBucket: 'pvvm-87506.firebasestorage.app',
        apiKey: 'AIzaSyCPfpwBLCgMi0BHb-JTWuvkoVAVpQVYaDI',
        authDomain: 'pvvm-87506.firebaseapp.com',
        messagingSenderId: '515391006887',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    // provideClientHydration(),
    // provideClientHydration(withEventReplay()),
    // importProvidersFrom(
    //   HttpClientModule,
    //   // AngularFireModule.initializeApp(environment.firebase),
    //    AngularFireAuthModule,
    //    AngularFirestoreModule
    // )
  ],
});

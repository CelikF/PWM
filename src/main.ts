// src/main.ts
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }    from '@angular/platform-browser';
import { AppComponent }            from './app/app.component';
import { provideRouter }           from '@angular/router';
import { routes }                  from './app/app.routes';
import { environment }             from './environments/environment';

// Ionic
import { IonicModule } from '@ionic/angular';

// AngularFire “compat”
import { AngularFireModule }       from '@angular/fire/compat';
import { AngularFireAuthModule }   from '@angular/fire/compat/auth';
import { AngularFirestoreModule }  from '@angular/fire/compat/firestore';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // importa i moduli compat di Firebase
    importProvidersFrom(
      IonicModule.forRoot(),
      AngularFireModule.initializeApp(environment.firebase), // ← fornisce angularfire2.app.options
      AngularFireAuthModule,      // ← fornisce AngularFireAuth
      AngularFirestoreModule,     // ← fornisce AngularFirestore
    ),
    provideRouter(routes)
  ]
});

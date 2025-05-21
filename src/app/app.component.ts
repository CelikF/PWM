import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';                 // ← importa dal pacchetto principale :contentReference[oaicite:0]{index=0}
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    IonicModule,
    RouterModule
  ],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {}

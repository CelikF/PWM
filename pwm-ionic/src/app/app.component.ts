import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonButton, IonButtons, IonToolbar, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonApp, IonRouterOutlet, RouterLink],
})
export class AppComponent {
  constructor() {}
}

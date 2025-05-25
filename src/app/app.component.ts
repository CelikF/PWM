import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonButton, IonButtons, IonToolbar, IonHeader } from '@ionic/angular/standalone';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth-service/auth.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonApp, IonRouterOutlet, RouterLink, NgxSonnerToaster],
})
export class AppComponent {
  private authSvc = inject(AuthService);
  private router = inject(Router);

  isLoginPage: boolean = false;

  constructor() {
    // Listen for route changes and update `isLoginPage`
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoginPage = this.router.url === '/login' || this.router.url === '/register';
    });
  }

  signout() {
    this.authSvc.logout();
    this.router.navigate(['login']);
  }
}

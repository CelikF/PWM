import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component'; // Import standalone component
import { AccountComponent } from './pages/account/account.component'; // Import standalone component

@NgModule({
  declarations: [
    // No declarations as all components are standalone
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'account', component: AccountComponent },
      { path: '', redirectTo: '/account', pathMatch: 'full' }
    ])
  ],
  providers: []
})
export class AppModule { }

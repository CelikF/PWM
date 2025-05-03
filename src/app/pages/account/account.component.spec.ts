import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: firebase.User | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.afAuth.authState.subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = `Errore nel recuperare i dati dell'utente: ${error.message}`;
        this.loading = false;
      }
    });
  }
}

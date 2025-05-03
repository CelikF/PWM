import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; // Percorso corretto al tuo AuthService
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Per gestire l'autenticazione Firebase
import firebase from 'firebase/compat/app'; // Importa Firebase per il tipo User
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: firebase.User | null = null; // Define a specific property for user data
  loading: boolean = true;  // Stato di caricamento
  errorMessage: string | null = null;

  constructor(
    private afAuth: AngularFireAuth   // Firebase Auth per la gestione dell'autenticazione
  ) {}

  ngOnInit(): void {
    this.getUserData();  // Carica i dati dell'utente quando il componente si inizializza
  }

  // Funzione per ottenere i dati dell'utente loggato
  getUserData(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
          this.user = user; // Assign the user object
          this.loading = false;  // Termina il caricamento
        } else {
          console.log('Nessun utente loggato');
          this.loading = false;
        }
      }, (error: any) => {
        this.errorMessage = `Errore nel recuperare i dati dell'utente: ${error.message}`;
        this.loading = false;
        console.log('Nessun utente loggato');
        this.loading = false;
      });
  }
}

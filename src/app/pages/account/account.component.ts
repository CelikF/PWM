import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Percorso al tuo AuthService
import { User } from '../models/user.model'; // Modello User
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Per gestire l'autenticazione Firebase

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User | null = null;  // Dati dell'utente
  loading: boolean = true;  // Stato di caricamento
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,  // Servizio per l'autenticazione
    private afAuth: AngularFireAuth   // Firebase Auth per la gestione dell'autenticazione
  ) {}

  ngOnInit(): void {
    this.getUserData();  // Carica i dati dell'utente quando il componente si inizializza
  }

  // Funzione per ottenere i dati dell'utente loggato
  getUserData(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then((userData) => {
          this.user = userData; // Salva i dati dell'utente
          this.loading = false;  // Termina il caricamento
        }).catch((error) => {
          this.errorMessage = `Errore nel recuperare i dati dell'utente: ${error.message}`;
          this.loading = false;
        });
      } else {
        console.log('Nessun utente loggato');
        this.loading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { AuthService } from './auth.service'; // esempio di un servizio di autenticazione

@Component({
  selector: 'app-account',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent {
  displayName: string = '';  // Variabile per il nome dell'utente

  constructor(private authService: AuthService) { }

  // Metodo per salvare il nome (può essere un'operazione su un DB come Firebase)
  saveProfile() {
    if (this.displayName) {
      this.authService.updateUserName(this.displayName).then(() => {
        alert('Profile updated successfully!');
      }).catch(err => {
        console.error('Error updating profile', err);
        alert('Failed to update profile.');
      });
    } else {
      alert('Please enter a valid name.');
    }
  }

  // Metodo per cambiare la foto del profilo (puoi usarlo per integrare una funzionalità di caricamento immagini)
  changeProfilePic() {
    console.log('Change profile picture clicked');
    // Puoi aggiungere qui una logica per cambiare la foto (ad esempio upload a Firebase)
  }
}

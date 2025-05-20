import { Component, OnInit, inject } from '@angular/core'; // Aggiungi inject
import { FormsModule } from '@angular/forms'; // Import FormsModule per ngModel
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-account',
  standalone: true, // Mark as standalone
  imports: [FormsModule, CommonModule], // Include FormsModule e CommonModule qui
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userName: string = 'name';
  userEmail: string = 'email';
  newPassword: string = '';
  confirmPassword: string = '';
  accountData = { name: '', email: '' }; // Dati dell'account
  loading = false;
  errorMessage = '';
  private firestore = inject(Firestore); // Inietta Firestore
  private auth = inject(Auth); // Inietta Auth per ottenere l'utente autenticato

  async ngOnInit() {
    try {
      this.loading = true;
      if (!this.auth.currentUser) throw new Error('User not logged in'); // Verifica l'autenticazione
      const userId = this.auth.currentUser.uid; // Ottieni l'uid dell'utente
      const userDoc = doc(this.firestore, `accounts/${userId}`); // Usa un percorso dinamico
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        this.accountData = docSnap.data() as { name: string; email: string };
      }
    } catch (err: any) {
      this.errorMessage = err.message;
    } finally {
      this.loading = false;
    }
  }

  async save() {
    try {
      this.loading = true;
      if (!this.auth.currentUser) throw new Error('User not logged in'); // Verifica l'autenticazione
      const userId = this.auth.currentUser.uid; // Ottieni l'uid dell'utente
      const userDoc = doc(this.firestore, `accounts/${userId}`); // Usa un percorso dinamico
      await setDoc(userDoc, this.accountData);
      alert('Account updated successfully!');
    } catch (err: any) {
      this.errorMessage = err.message;
    } finally {
      this.loading = false;
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Selected file:', file);
      // Puoi aggiungere logica per caricare il file o visualizzarlo
    }
  }
}

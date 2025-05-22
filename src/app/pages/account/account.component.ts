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
  accountData = {
    username: '', // valore iniziale vuoto
    email: ''
  };
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  private firestore = inject(Firestore); // Inietta Firestore
  private auth = inject(Auth); // Inietta Auth per ottenere l'utente autenticato

  async ngOnInit() {
    try {
      this.loading = true;
      if (!this.auth.currentUser) throw new Error('User not logged in');
      const userId = this.auth.currentUser.uid;
      const userDoc = doc(this.firestore, `accounts/${userId}`);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        console.log('Firestore user data:', data); // <-- debug: controlla la console
        this.accountData.username = data.username || '';
        this.accountData.email = data.email || data.mail || data['e-mail'] || '';
      }
    } catch (err: any) {
      this.errorMessage = err.message;
    } finally {
      this.loading = false;
    }
  }

  async save() {
    this.errorMessage = '';
    this.loading = true;

    // Validazione base
    if (!this.accountData.username || !this.accountData.email) {
      this.errorMessage = 'Username and email are required.';
      this.loading = false;
      return;
    }
    // Se si vuole cambiare password, serve la vecchia password e la conferma
    if (this.newPassword || this.confirmPassword) {
      if (!this.oldPassword) {
        this.errorMessage = 'Old password is required to change password.';
        this.loading = false;
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'New passwords do not match.';
        this.loading = false;
        return;
      }
      // Qui dovresti verificare la vecchia password con il backend
    }

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

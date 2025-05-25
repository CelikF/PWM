import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accountData = {
    username: '',
    email: ''
  };
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async ngOnInit() {
    try {
      this.loading = true;
      if (!this.auth.currentUser) throw new Error('User not logged in');
      const userId = this.auth.currentUser.uid;
      const userDoc = doc(this.firestore, `accounts/${userId}`);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        console.log('Firestore user data:', data); // debug
        this.accountData.username = data.username || data.user || data.nomeutente || '';
        this.accountData.email = data.email || data.mail || data['e-mail'] || data['E-mail'] || '';
      }
      // Prendi l'email anche da Firebase Auth se non trovata su Firestore
      if (!this.accountData.email && this.auth.currentUser?.email) {
        this.accountData.email = this.auth.currentUser.email;
      }
      // Prendi username da Firebase Auth se non trovato
      if (!this.accountData.username && this.auth.currentUser?.displayName) {
        this.accountData.username = this.auth.currentUser.displayName;
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

    if (!this.accountData.username || !this.accountData.email) {
      this.errorMessage = 'Username and email are required.';
      this.loading = false;
      return;
    }

    try {
      if (!this.auth.currentUser) throw new Error('User not logged in');
      const userId = this.auth.currentUser.uid;
      const userDoc = doc(this.firestore, `accounts/${userId}`);

      // Aggiorna email su Firebase Auth se cambiata
      if (this.accountData.email !== this.auth.currentUser.email) {
        if (!this.oldPassword) {
          this.errorMessage = 'Enter your old password to change email.';
          this.loading = false;
          return;
        }
        const credential = EmailAuthProvider.credential(this.auth.currentUser.email!, this.oldPassword);
        await reauthenticateWithCredential(this.auth.currentUser, credential);
        await updateEmail(this.auth.currentUser, this.accountData.email);
      }

      // Aggiorna username su Firebase Auth se cambiato
      if (this.accountData.username !== this.auth.currentUser.displayName) {
        await updateProfile(this.auth.currentUser, { displayName: this.accountData.username });
      }

      // Aggiorna password se richiesto
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
        const credential = EmailAuthProvider.credential(this.auth.currentUser.email!, this.oldPassword);
        await reauthenticateWithCredential(this.auth.currentUser, credential);
        await updatePassword(this.auth.currentUser, this.newPassword);
      }

      // Aggiorna Firestore (tutte le varianti di username/email)
      await setDoc(userDoc, {
        username: this.accountData.username,
        user: this.accountData.username,
        nomeutente: this.accountData.username,
        email: this.accountData.email,
        mail: this.accountData.email,
        'e-mail': this.accountData.email,
        'E-mail': this.accountData.email
      });

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
      // Da implementare: upload immagine profilo
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-account',
  standalone: true, // Mark as standalone
  imports: [FormsModule], // Include FormsModule here
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  userName: string = '';
  userEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log('Selected file:', file);
    // You can display it or upload it later
  }

  saveSettings(): void {
    console.log('Settings saved:', {
      userName: this.userName,
      userEmail: this.userEmail,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }
}

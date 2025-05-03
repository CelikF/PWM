import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from // Adjusted the relative path
// Ensure the following paths are correct and the services are exported

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent implements OnInit {
  displayName: string = '';
  user: any = {}; // Holds the current user data
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.dataService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedData = this.form.value;
      this.dataService.updateUser(this.user.id, updatedData).subscribe(() => {
        alert('User updated successfully!');
      });
    }
  }

  saveName() {
    alert('Nome salvato: ' + this.displayName);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent {
  displayName: string = '';

  saveName() {
    alert('Nome salvato: ' + this.displayName);
  }
}

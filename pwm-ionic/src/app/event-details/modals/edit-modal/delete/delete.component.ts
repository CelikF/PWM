import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { DataService } from 'src/app/event-details/services/data.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [IonButton]
})
export class DeleteComponent{

  event = input.required<any>();
  private dataSvc = inject(DataService);
  @Output() close = new EventEmitter<boolean>();
  router = inject(Router);

  async submit(){
    const id = this.event()!.id.toString();
    this.dataSvc.deleteEvent(id);
    this.close.emit(true);
    // this.router.navigate(['/home']);

    try {
      await this.dataSvc.deleteEvent(id);
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event.');
    }
  }

  closeModal(){
    this.close.emit(true);
  }

}

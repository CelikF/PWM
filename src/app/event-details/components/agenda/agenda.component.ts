import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { ModalPayload } from '../../modals/edit-modal/edit-modal.component';

@Component({
  selector: 'app-agenda',
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {

  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;
  @Output() editModal = new EventEmitter<ModalPayload>();

  activities = this.getActivities();

  getActivities(){
    return this.dataSvc.activities$(this.eventId);
   }

  openEditModal(payload: ModalPayload){
    this.editModal.emit(payload);
  }

}

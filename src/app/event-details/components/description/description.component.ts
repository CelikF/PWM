import { Component, computed, effect, EventEmitter, inject, input, Output, output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService, Event } from '../../services/data.service';
import { EventDetailsComponent } from '../../event-details.component';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { ModalPayload } from '../../modals/edit-modal/edit-modal.component';

@Component({
  selector: 'app-description',
  imports: [CommonModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  event = this.getEvent();
  @Output() editModal = new EventEmitter<ModalPayload>();



  getEvent(){
    return this.dataSvc.event(this.eventId);
   }
  
   openEditModal(payload: ModalPayload){
    this.editModal.emit(payload);
   }
}

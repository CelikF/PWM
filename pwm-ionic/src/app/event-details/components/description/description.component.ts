import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { ModalPayload } from '../../modals/edit-modal/edit-modal.component';
import { IonGrid, IonButton, IonCol, IonCard, IonCardHeader, IonText, IonCardContent, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'app-description',
  imports: [IonRow, IonCardContent, IonText, IonCardHeader, IonCard, IonCol, IonButton, IonGrid, CommonModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);
  

  hostView = false;
  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  event = this.getEvent();
  @Output() editModal = new EventEmitter<ModalPayload>();

  ngOnInit(): void {
    this.dataSvc.getHostView().subscribe(val => {
      this.hostView = val;
    });
  }

  getEvent(){
    return this.dataSvc.event(this.eventId);
   }
  
   openEditModal(payload: ModalPayload){
    this.editModal.emit(payload);
   }
}

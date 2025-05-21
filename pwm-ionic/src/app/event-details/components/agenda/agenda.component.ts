import { Component, EventEmitter, inject, Output, Signal } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { ModalPayload, ParentPayload } from '../../modals/edit-modal/edit-modal.component';
import { IonButton, IonCard, IonText, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-agenda',
  imports: [IonLabel, IonText, IonCard, IonButton, CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {

  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  private outletData = inject(ROUTER_OUTLET_DATA) as Signal<ParentPayload>; 
  hostView: boolean = this.outletData().hostView; 

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;
  @Output() editModal = new EventEmitter<ModalPayload>();

  activities = this.getActivities();

  getActivities(){
    return this.dataSvc.activities$(this.eventId);
   }

  openEditModal(payload: ModalPayload){
    this.editModal.emit(payload);
  }

  addActivity(payload: ModalPayload){
    this.editModal.emit(payload);
  }

  async onDeletePress(id: string){
    await this.dataSvc.deleteActivity(this.eventId, id);
  }

}

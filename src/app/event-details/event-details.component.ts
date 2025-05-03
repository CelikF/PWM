import { Component, computed, effect, EventEmitter, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EditModalComponent, ModalPayload } from './modals/edit-modal/edit-modal.component';
import { DataService } from './services/data.service';
import { Timestamp } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-details',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, EditModalComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {

  active_tab: string = "description";
  isEditModalOpen = false;

  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  eventId = this.route.snapshot.paramMap.get('eventId')!;
  modalType = "";
  modalId = "";

  event = this.getEvent();
  childSub?: Subscription;


  onTabClick(tab: string){
    this.active_tab = tab;
  }
  
  openEditModal(payload: ModalPayload){
    this.isEditModalOpen = true;
    this.modalType = payload.modal_name;
    if (payload.id){
      this.modalId = payload.id;
    }
    console.log(this.modalType);
  }

  getEvent(){
   return this.dataSvc.event(this.eventId);
  }

  onChildActivate(child: any) {
    // tear down any previous subscription
    this.childSub?.unsubscribe();

    // if the child has an `editModal: EventEmitter<string>`
    if (child.editModal?.subscribe) {
      this.childSub = child.editModal.subscribe((payload: ModalPayload) => {
        console.log('Got from child:', payload.modal_name);
        // now you can pass that string into your modal, e.g.
        this.openEditModal(payload);
      });
    }
  }

  handleCloseModal(event: any){
    if (event){
      this.isEditModalOpen = false;
    }
  }
}

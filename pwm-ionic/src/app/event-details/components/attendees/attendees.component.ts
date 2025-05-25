import { Component, computed, effect, EventEmitter, inject, Output, Signal } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';
import { Attendee, DataService } from '../../services/data.service';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { ModalPayload, ParentPayload } from '../../modals/edit-modal/edit-modal.component';
import { IonCol, IonCard, IonCardHeader, IonCardContent, IonRow, IonGrid, IonButton, IonItem, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/angular/standalone";

@Component({
  selector: 'app-attendees',
  imports: [IonList, IonLabel, IonItem, IonButton, IonGrid, IonRow, IonCardContent, IonCardHeader, IonCard, IonCol, CommonModule, IonList, IonSelect, IonSelectOption],
  templateUrl: './attendees.component.html',
  styleUrl: './attendees.component.css'
})
export class AttendeesComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);

  @Output() editModal = new EventEmitter<ModalPayload>();

  private outletData = inject(ROUTER_OUTLET_DATA) as Signal<ParentPayload>; 
  hostView: boolean = this.outletData().hostView; 

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  attendees = this.getAttendees();
  users = this.getUsers();
  ids = computed(() => {
    return this.attendees().map(att => att.id);
  })

  currentAttendee: any;

  // emailMap$= this.authSvc.getEmailsForUids(this.ids);


  // user = this.getUser();

  // async getUser(){
  //   console.log( await this.authSvc.getCurrentUser());
  // }

  constructor(){
    effect(() => {
      this.currentAttendee = this.getCurrentAttendee();
    })
  }

  openEditModal(payload: ModalPayload){
      this.editModal.emit(payload);
    }

  getUserName(att: Attendee){
    const usrs = this.users();
    const match = usrs.find(u => u.id?.toString() === att.id.toString());
      return match
        ? match.username
        : null;
  }

  getCurrentAttendee(){
    const usrs = this.users();
    const curr_user = usrs?.find(u => u.email?.toString() === this.authSvc.getCurrentUser()?.email);
    
    const attendees = this.attendees();
    const curr_att = attendees?.find(att => att.id.toString() === curr_user?.id?.toString());
    if (!curr_att) return;
    return curr_att
  }

  getAttendees(){
    return this.dataSvc.attendees$(this.eventId);
   }

  getUsers(){
    return this.authSvc.getUsers();
  }

  updateCurrentAttendee(data:any){
    return this.dataSvc.updateAttendee(this.eventId, this.currentAttendee.id, data);
  }
}

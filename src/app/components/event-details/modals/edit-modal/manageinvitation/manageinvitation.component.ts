import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../../../services/auth-service/auth.service';
import { IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { Attendee, DataService, Event } from 'src/app/services/data-access/data.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-manageinvitation',
  imports: [ReactiveFormsModule, IonInput, IonButton, IonIcon],
  templateUrl: './manageinvitation.component.html',
  styleUrl: './manageinvitation.component.css'
})
export class ManageinvitationComponent {
  @Input() event!: Event;
  @Input() attendees!: Attendee[];
  @Input() activityId!: string;

  @Output() close = new EventEmitter<boolean>();

  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);

  users = this.getUsers();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });
  }

  getUserName(att: Attendee){
      const usrs = this.users();
      const match = usrs.find(u => u.id?.toString() === att.id.toString());
        return match
          ? match.username
          : null;
    }

    getID(em: string){
      const usrs = this.users();
      const match = usrs.find(u => u.email?.toString() === em);
      if (!match?.id) return;
      return match
          ? match.id.toString()
          : null;
    }

    getAttendees(){
      return this.dataSvc.attendees$(this.event.id.toString());
     }
  
    getUsers(){
      return this.authSvc.getUsers();
    }

    addAttendee(){
      toast.info("Invitation has been sent.");
      const atte: Attendee = {status:"pending", id: this.getID(this.form.value.email)} as Attendee; 
      this.dataSvc.addAttendee(this.event.id.toString(), atte)
    }

    deleteAttendee(id: string){
      toast.info("User has been removed from your event");
      return this.dataSvc.deleteAttendee(this.event.id.toString(), id.toString());
    }

    closeModal(){
      this.close.emit(true);
    }
}

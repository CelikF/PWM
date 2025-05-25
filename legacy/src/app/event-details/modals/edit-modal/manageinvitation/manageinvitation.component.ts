import { Component, computed, effect, EventEmitter, inject, Injector, Input, Output, runInInjectionContext, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attendee, DataService, Event } from '../../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { ModalPayload } from '../edit-modal.component';
import { firstValueFrom, materialize } from 'rxjs';

@Component({
  selector: 'app-manageinvitation',
  imports: [ReactiveFormsModule],
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
      const atte: Attendee = {status:"pending", id: this.getID(this.form.value.email)} as Attendee; 
      this.dataSvc.addAttendee(this.event.id.toString(), atte)
    }

    deleteAttendee(id: string){
      return this.dataSvc.deleteAttendee(this.event.id.toString(), id.toString());
    }

    closeModal(){
      this.close.emit(true);
    }
}

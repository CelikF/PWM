import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-attendees',
  imports: [],
  templateUrl: './attendees.component.html',
  styleUrl: './attendees.component.css'
})
export class AttendeesComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  attendees = this.getAttendees();

  // constructor(){
  //   effect(() => {
  //     console.log(this.attendees())
  //   })
  // }

  getAttendees(){
    return this.dataSvc.attendees$(this.eventId);
   }
}

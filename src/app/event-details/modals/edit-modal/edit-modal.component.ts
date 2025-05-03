import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { Event } from '../../services/data.service';
import { DescriptionComponent } from './description/description.component';
import { LocationComponent } from './location/location.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { ActivityComponent } from './activity/activity.component';

export interface ModalPayload{
    modal_name:string;
    id?:string;
}


@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
  imports: [
    TitleComponent,
    DescriptionComponent,
    LocationComponent,
    DatetimeComponent,
    ActivityComponent]
})
export class EditModalComponent {
  @Output() close = new EventEmitter<boolean>();
  event = input.required<Event>();

  modalType = input.required<string>();
  modalId = input<string>();

  handleCloseModal(event: any){
    if (event){
      this.close.emit(true);
    }
  }
  
}
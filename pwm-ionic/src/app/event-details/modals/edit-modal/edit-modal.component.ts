import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { Attendee, Event } from '../../services/data.service';
import { DescriptionComponent } from './description/description.component';
import { LocationComponent } from './location/location.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { ActivityComponent } from './activity/activity.component';
import { NewscardComponent } from './newscard/newscard.component';
import { ManageinvitationComponent } from './manageinvitation/manageinvitation.component';
import { ImageComponent } from './image/image.component';
import { DeleteComponent } from "./delete/delete.component";

export interface ModalPayload{
    modal_name:string;
    id?:string;
}

export interface ParentPayload{
  hostView: boolean
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
    ActivityComponent,
    NewscardComponent,
    ManageinvitationComponent,
    ImageComponent,
    DeleteComponent
]
})
export class EditModalComponent {
  @Output() close = new EventEmitter<boolean>();
  event = input.required<Event>();
  attendees = input.required<Attendee[]>();

  @Output() imageSelected = new EventEmitter<{
    url: string;
    file?: File;
  }>();

  modalType = input.required<string>();
  modalId = input<string>();

  handleCloseModal(event: any){
    if (event){
      this.close.emit(true);
    }
  }

  onImagePicked(selection: { url: string; file?: File }) {
    this.imageSelected.emit(selection);
  }
}
import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonButton, IonInput } from "@ionic/angular/standalone";
import { toast } from 'ngx-sonner';
import { DataService } from 'src/app/services/data-access/data.service';

@Component({
  selector: 'app-location',
  imports: [IonButton, ReactiveFormsModule, IonInput],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  event = input.required<any>();
  @Output() close = new EventEmitter<boolean>();

  formbuilder = inject(FormBuilder);
  dataSvc = inject(DataService);

  form = this.formbuilder.group({
    location: this.formbuilder.control('',Validators.required)
  })

  constructor(){
    effect(() => {
      const ev = this.event();
      if (ev) {
        this.form.patchValue({ location: ev.location });
      }
    });
  }

  saveChanges(){
    const newLocation = this.form.value.location!.trim();
    const id = this.event()!.id.toString();
    this.dataSvc.updateEvent(id, { location: newLocation });
    this.close.emit(true);
    toast.info("Location has been changed.")
  }

  cancelChanges(){
    this.close.emit(true);
  }
}

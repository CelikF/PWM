import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonButton, IonTextarea } from '@ionic/angular/standalone';
import { toast } from 'ngx-sonner';
import { DataService } from 'src/app/services/data-access/data.service';

@Component({
  selector: 'app-description',
  imports: [ReactiveFormsModule, IonTextarea, IonButton],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
  event = input.required<any>();
  @Output() close = new EventEmitter<boolean>();

  formbuilder = inject(FormBuilder);
  dataSvc = inject(DataService);

  form = this.formbuilder.group({
    description: this.formbuilder.control('',Validators.required)
  })

  constructor(){
    effect(() => {
      const ev = this.event();
      if (ev) {
        this.form.patchValue({ description: ev.description });
      }
    });
  }

  saveChanges(){
    const newDescription = this.form.value.description!.trim();
    const id = this.event()!.id.toString();
    this.dataSvc.updateEvent(id, { description: newDescription });
    this.close.emit(true);
    toast.info("Description has been updated.")
  }

  cancelChanges(){
    this.close.emit(true);
  }
}

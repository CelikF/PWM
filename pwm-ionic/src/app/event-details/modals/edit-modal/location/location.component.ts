import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-location',
  imports: [ReactiveFormsModule],
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
  }

  cancelChanges(){
    this.close.emit(true);
  }
}

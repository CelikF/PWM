import { Component, computed, effect, EventEmitter, inject, input, Output, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-title',
  imports: [ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {

  event = input.required<any>();
  @Output() close = new EventEmitter<boolean>();

  formbuilder = inject(FormBuilder);
  dataSvc = inject(DataService);

  form = this.formbuilder.group({
    title: this.formbuilder.control('',Validators.required)
  })

  constructor(){
    effect(() => {
      const ev = this.event();
      if (ev) {
        this.form.patchValue({ title: ev.title });
      }
    });
  }

  async getTitle(){
    const val = this.event().title;
    return val;
  }

  async saveTitle(){
    try {
      const newTitle = this.form.value.title!.trim();
      const id = this.event()!.id.toString();
      await this.dataSvc.updateEvent(id, { title: newTitle });
      this.close.emit(true);
    } catch (error) {
      console.log(error);
    }
    
  }
  
  cancelChanges(){
    this.close.emit(true);
  }
}

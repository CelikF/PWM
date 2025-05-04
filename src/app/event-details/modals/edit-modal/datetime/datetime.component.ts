import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-datetime',
  imports: [ReactiveFormsModule],
  templateUrl: './datetime.component.html',
  styleUrl: './datetime.component.css'
})
export class DatetimeComponent {
  event = input.required<any>();
  @Output() close = new EventEmitter<boolean>();

  formbuilder = inject(FormBuilder);
  dataSvc = inject(DataService);

  minDate = new Date().toISOString().split('T')[0];
  maxDate = '2050-12-31';

  form = this.formbuilder.group({
    date: this.formbuilder.control('', Validators.required),
    time: this.formbuilder.control('', Validators.required),
  });

  constructor(){
    effect(() => {
      const ev = this.event();
    if (ev?.datetime) {
      const d = (ev.datetime.toDate()).toISOString().split('T')[0];
      const t = (ev.datetime.toDate()).toTimeString().slice(0,5);
      this.form.patchValue({ date: d, time: t });
    }
    })
  }

  async saveChanges(){
    if (this.form.invalid) return;
    const { date, time } = this.form.value;
    const id = this.event()!.id.toString();
    const iso = `${date}T${time}:00`;
    const jsDate = new Date(iso);
    const ts = Timestamp.fromDate(jsDate);
    await this.dataSvc.updateEvent(id, { datetime: ts });
    this.close.emit(true);
  }

  cancelChanges(){
    this.close.emit(true);
  }
}

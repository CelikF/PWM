import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { IonButton, IonLabel, IonDatetime } from "@ionic/angular/standalone";
import { DataService } from 'src/app/services/data-access/data.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-datetime',
  imports: [IonLabel, IonButton, ReactiveFormsModule, IonDatetime],
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
    datetime: this.formbuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      const ev = this.event();
      if (ev?.datetime) {
        const local = ev.datetime.toDate();
        const tzOffsetMs = local.getTimezoneOffset() * 60000;
        const localISO = new Date(local.getTime() - tzOffsetMs).toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
        this.form.patchValue({ datetime: localISO });
      }
    });
  }

  async saveChanges() {
    if (this.form.invalid) return;
    const datetime = this.form.value.datetime;
    if (!datetime) return;

    const id = this.event()!.id.toString();
    const jsDate = new Date(datetime);
    const ts = Timestamp.fromDate(jsDate);
    await this.dataSvc.updateEvent(id, { datetime: ts });
    this.close.emit(true);
    toast.info("Datetime updated")
  }


  cancelChanges(){
    this.close.emit(true);
  }
}

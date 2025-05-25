import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity, DataService, Event } from '../../../services/data.service';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonDatetime, IonInput, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-activity',
  imports: [IonLabel, IonButton, IonInput, IonDatetime, ReactiveFormsModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  standalone: true
})
export class ActivityComponent implements OnInit {
  @Input() event!: Event;
  @Input() activityId!: string;

  @Output() close = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      activity_name: ['', Validators.required],
      start_time: [''],
      end_time: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    const eventId = this.event.id.toString();
    try {
      if (!(this.activityId === "-1")){
        // Fetch the activity data once using firstValueFrom to get a single emission
        const activity: Activity | undefined = await firstValueFrom(
          this.dataService.activity(eventId, this.activityId)
        );
        if (activity) {

          const st = (activity.start_time)
          const et = (activity.end_time)

          this.form.patchValue({
            activity_name: activity.activity_name,
            start_time: st,
            end_time: et
          });
        }
      }
      // The Observable is automatically unsubscribed after emitting the first value.
    } catch (error) {
      console.error('Failed to load activity data', error);
    }
  }

  cancelChanges(){
    this.close.emit(true);
  }

  async saveChanges() {
    if (this.form.invalid) {
      return;
    }

    const eventId = this.event.id.toString();
    let actId   = this.activityId;
    const update: Partial<Activity> = {
      activity_name: this.form.value.activity_name,
      start_time:    this.form.value.start_time,
      end_time:      this.form.value.end_time
    };

    try {
      if (!(actId === "-1")) {
        // existing activity → update
        await this.dataService.updateActivity(eventId, actId, update);
        console.log('Activity updated.');
        this.close.emit(true);
      } else {
        // new activity → create
        await this.dataService.addActivity(eventId, update as Activity);
        console.log('Activity created.');
        this.close.emit(true);
      }
    } catch (err) {
      console.error('Failed to save activity', err);
    }
  }
}
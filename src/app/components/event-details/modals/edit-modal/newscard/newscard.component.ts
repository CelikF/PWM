import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { IonInput, IonLabel, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { DataService, NewsItem, Event } from 'src/app/services/data-access/data.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-newscard',
  imports: [IonButton, ReactiveFormsModule, IonLabel, IonInput, IonTextarea],
  templateUrl: './newscard.component.html',
  styleUrl: './newscard.component.css'
})
export class NewscardComponent {
  @Input() event!: Event;
  @Input() newsId!: string;

  @Output() close = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    const eventId = this.event.id.toString();
    try {
      if (!(this.newsId === "-1")){
        // Fetch the news data once using firstValueFrom to get a single emission
        const newsitem: NewsItem | undefined = await firstValueFrom(
          this.dataService.newsitem(eventId, this.newsId)
        );
        if (newsitem) {

          this.form.patchValue({
            title: newsitem.title,
            description: newsitem.description,
          });
        }
      }
      // The Observable is automatically unsubscribed after emitting the first value.
    } catch (error) {
      console.error('Failed to load news data', error);
      // Handle error (e.g., show a notification)
    }
  }

  cancelChanges(){
    this.close.emit(true);
  }

  async saveChanges() {
    if (this.form.invalid) {
      return; // you might show validation errors here
    }

    const eventId = this.event.id.toString();
    const nId   = this.newsId;
    const update: Partial<NewsItem> = {
      title: this.form.value.title,
      description:    this.form.value.description,
    };

    try {
      if (!(nId  === "-1")) {
        // existing news → update
        await this.dataService.updateNews(eventId, nId, update);
        toast.info('Newscard has been updated.');
      } else {
        // new news → create
        await this.dataService.addNews(eventId, update as NewsItem);
        toast.info('Newscard has been created.');
      }      // tell parent to close the modal
      this.close.emit(true);
    } catch (err) {
      toast.error('Failed to save modifications');
      // you could show an error notification here
    }
  }
}

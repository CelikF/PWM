import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Activity, DataService, Event, NewsItem } from '../../../services/data.service';
import { ModalPayload } from '../edit-modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-newscard',
  imports: [ReactiveFormsModule],
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
        console.log('news updated.');
      } else {
        // new news → create
        await this.dataService.addNews(eventId, update as NewsItem);
        console.log('news created.');
      }      // tell parent to close the modal
    } catch (err) {
      console.error('Failed to save news', err);
      // you could show an error notification here
    }
  }
}

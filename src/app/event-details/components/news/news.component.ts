import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  news = this.getNews();

  getNews(){
    return this.dataSvc.news$(this.eventId);
   }
}

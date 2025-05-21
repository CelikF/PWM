import { Component, effect, EventEmitter, inject, Output, Signal } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ModalPayload, ParentPayload } from '../../modals/edit-modal/edit-modal.component';
import { IonText, IonButton, IonIcon, IonCard } from "@ionic/angular/standalone";

@Component({
  selector: 'app-news',
  imports: [IonCard, IonIcon, IonButton, IonText, ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  private outletData = inject(ROUTER_OUTLET_DATA) as Signal<ParentPayload>; 
  hostView: boolean = this.outletData().hostView; 

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  @Output() editModal = new EventEmitter<ModalPayload>();

  news = this.getNews();

  getNews(){
    return this.dataSvc.news$(this.eventId);
   }

   addNewsitem(payload: ModalPayload){
    this.editModal.emit(payload);
  }

   openEditModal(payload: ModalPayload){
       this.editModal.emit(payload);
  }

   async onDeletePress(id: string){
    await this.dataSvc.deleteNews(this.eventId, id);
  }
}

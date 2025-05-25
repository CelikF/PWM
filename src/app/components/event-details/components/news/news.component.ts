import { Component, EventEmitter, inject, Output, Signal } from '@angular/core';
import { ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';

import { ModalPayload, ParentPayload } from '../../modals/edit-modal/edit-modal.component';
import { IonText, IonButton, IonCard } from "@ionic/angular/standalone";
import { DataService } from 'src/app/services/data-access/data.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-news',
  imports: [IonCard, IonButton, IonText, ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  private route = inject(ActivatedRoute);
  private dataSvc = inject(DataService);

  private outletData = inject(ROUTER_OUTLET_DATA) as Signal<ParentPayload>; 
  hostView = false;

  eventId = this.route.parent!.snapshot.paramMap.get('eventId')!;

  @Output() editModal = new EventEmitter<ModalPayload>();

  news = this.getNews();

  ngOnInit(): void {
    this.dataSvc.getHostView().subscribe(val => {
      this.hostView = val;
    });
  }

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
    toast.info("Newscard has been removed.")
  }
}

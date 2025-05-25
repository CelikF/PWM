import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonButton, IonImg } from '@ionic/angular/standalone';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-image',
  imports: [IonImg, ReactiveFormsModule, CommonModule, IonButton],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  event = input.required<any>();
  @Output() close = new EventEmitter<boolean>();

  @Output() imageSelected = new EventEmitter<{
    url: string;
    file?: File;
  }>();

  pathInput = '';
  ogInput = '';
  imageUrl: string | null = null;

  constructor(){
    effect(() => {
      this.ogInput = this.event().image;
    })
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.ogInput = this.event().image;
    if (!file) return;

    console.log(file);

    // create a local preview URL
    const url = URL.createObjectURL(file);
    this.imageUrl = url;
    
    this.pathInput = '/assets/'+file.name;
  }

  browse(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  saveChanges(){
    try {
      this.imageSelected.emit({ url:this.pathInput });
      this.close.emit(true);
      toast.info("Image has been updated.");
    } catch (error) {
      console.error('Failed to save image', error);
      toast.error("Image could not be saved");
    }
  }

  cancelChanges(){
    this.imageSelected.emit({ url:this.ogInput });
    this.close.emit(true);
  }
}

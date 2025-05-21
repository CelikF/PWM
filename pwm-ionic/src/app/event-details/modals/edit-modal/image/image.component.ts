import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  imports: [ReactiveFormsModule, CommonModule],
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
    this.close.emit(true);
    // emit both preview URL AND the raw File
    this.imageSelected.emit({ url:this.pathInput });
  }

  cancelChanges(){
    this.imageSelected.emit({ url:this.ogInput });
    this.close.emit(true);
  }
}

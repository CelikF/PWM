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
  imageUrl: string | null = null;

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // create a local preview URL
    const url = URL.createObjectURL(file);
    this.imageUrl = url;
    
    this.pathInput = file.name;

    // emit both preview URL AND the raw File
    this.imageSelected.emit({ url });
  }

  onPathChange() {
    const url = this.pathInput.trim();
    if (!url) {
      this.imageUrl = null;
      return;
    }
    this.imageUrl = url;
    // when user typed a URL there's no File object
    this.imageSelected.emit({ url });
  }

  browse(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  saveChanges(){
    this.close.emit(true);
  }

  cancelChanges(){
    this.close.emit(true);
  }
}

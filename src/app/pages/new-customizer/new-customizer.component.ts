import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-news-customizer',
  standalone: true,
  imports: [FormsModule], // Ensure FormsModule is imported for ngModel
  templateUrl: './new-customizer.component.html',
  styleUrls: ['./new-customizer.component.css']
})
export class NewsCustomizerComponent {
  news = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    date: '',
    category: ''
  };
}

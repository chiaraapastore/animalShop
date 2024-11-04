import { Component } from '@angular/core';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  email: string = '';
  message: string = '';
  rating: number = 0;

  constructor(private feedbackService: FeedbackService) {}

  setRating(value: number): void {
    this.rating = value;
  }

  sendFeedback(): void {
    const feedback = {
      email: this.email,
      message: this.message,
      rating: this.rating
    };

    this.feedbackService.sendFeedback(feedback).subscribe(
      (response) => {
        alert('Grazie per il tuo feedback!');
        this.resetForm();
      },
      (error) => {
        alert('Si è verificato un errore. Riprova più tardi.');
      }
    );
  }

  resetForm(): void {
    this.email = '';
    this.message = '';
    this.rating = 0;
  }
}

import { Component, OnInit } from '@angular/core';
import { FeedbackService } from './feedback.service';

export interface Feedback {
  email: string;
  feedback: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  email: string = '';
  feedback: string = '';

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {}

  sendFeedback(): void {
    const feedbackData: Feedback = {
      email: this.email,
      feedback: this.feedback
    };

    this.feedbackService.sendFeedback(feedbackData).subscribe(
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
    this.feedback = '';
  }
}

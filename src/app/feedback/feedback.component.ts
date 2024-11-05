import { Component, Renderer2, OnInit} from '@angular/core';
import { FeedbackService } from './feedback.service';
import { HttpClient } from '@angular/common/http';

export interface Feedback {
  email: string;
  message: string;
  rating: number;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  email: string = '';
  message: string = '';
  rating: number = 0;

  private url: string = 'http://localhost:8081/api/feedback/save';

  constructor(private feedbackService: FeedbackService, private http: HttpClient, private render: Renderer2) {}

  ngOnInit(): void {
    this.render.addClass(document.body, 'feedback-page');
  }


  setRating(value: number): void {
    this.rating = value;
  }

  sendFeedback(): void {
    const feedback: Feedback = {
      email: this.email,
      message: this.message,
      rating: this.rating
    };

    this.http.post(this.url, feedback).subscribe(
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

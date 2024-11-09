import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = 'http://localhost:8081/api/feedback/save'; // URL del backend

  constructor(private http: HttpClient) {}

  // Metodo per inviare il feedback al backend
  sendFeedback(feedback: { email: string; message: string; rating: number }): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }
}

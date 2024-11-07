import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit, OnDestroy {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  message: string = '';

  private url: string = 'http://localhost:8081/api/contact/send';

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'contact-page');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'contact-page');
  }

  sendMessage() {
    const contactData = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      message: this.message
    };

    this.http.post(this.url, contactData).subscribe(
      (response) => {
        alert('Messaggio inviato con successo!');
        this.resetForm();
      },
      (error) => {
        alert("Errore durante l'invio del messaggio");
      }
    );
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.message = '';
  }
}

import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'contact-page');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'contact-page');
  }

  sendContact() {
    alert(`Grazie per averci contattato, ${this.name}! Risponderemo al più presto.`);
    this.resetForm();
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.message = '';
  }
}

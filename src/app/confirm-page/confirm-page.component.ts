import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit {
  ngOnInit() {
    document.body.classList.add('confirm-page');
  }

  ngOnDestroy() {
    document.body.classList.remove('confirm-page'); // Rimuove la classe quando il componente viene distrutto
  }
}

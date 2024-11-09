import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario.rossi@example.com'
  };

  constructor() { }

  ngOnInit(): void {
    //TODO caricare i dati del profilo al caricamneto della pagina tramite API userDetails
  }

  editProfile(): void {
    //TODO richiamare API che ti permette di aggiornare il profilo
    console.log('Modifica profilo cliccata');
  }
}

import { Component, OnInit } from '@angular/core';
import {UtenteShopService} from "../services/utenteShop.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    email: ''
  };
  errorMessage: string = '';

  constructor(private utenteShopService: UtenteShopService, private router: Router) { }

  ngOnInit(): void {
    this.utenteShopService.getUserDetails().subscribe(
      (userData) => {
        this.user = userData;
      },
      (error) => {
        console.error('Errore durante il recupero dei dati dell\'utente:', error);
      }
    );
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }
}

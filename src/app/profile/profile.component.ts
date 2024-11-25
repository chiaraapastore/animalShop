import { Component, OnInit } from '@angular/core';
import { UtenteShopService } from '../services/utenteShop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  errorMessage: string = '';

  constructor(private utenteShopService: UtenteShopService, private router: Router) {}

  ngOnInit(): void {
    this.utenteShopService.getUserDetailsDataBase().subscribe(
      userData => {
        this.userDetails = userData;
      },
      error => {
        console.error("Errore durante il recupero dei dati dell'utente:", error);
        this.errorMessage = 'Errore durante il recupero del profilo utente.';
      }
    );
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }
}

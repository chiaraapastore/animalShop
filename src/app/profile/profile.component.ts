import { Component, OnInit } from '@angular/core';
import { UtenteShopService } from "../services/utenteShop.service";
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null; // Dettagli dell'utente loggato
  errorMessage: string = '';
  registerForm: FormGroup;

  constructor(private utenteShopService: UtenteShopService, private formBuilder: FormBuilder,
              private router: Router) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      numberCell: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.utenteShopService.getUserDetails().subscribe(
      (userData) => {
        this.user = userData; // Popola i dati dell'utente
      },
      (error) => {
        console.error('Errore durante il recupero dei dati dell\'utente:', error);
        this.errorMessage = 'Errore durante il recupero del profilo utente.';
      }
    );
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      console.log('Dati del modulo:', userData); // Debug
      this.utenteShopService.registerUser(userData).subscribe(
        (response) => {
          console.log('Utente registrato con successo:', response);
          this.router.navigate(['/login']); // Reindirizza al login
        },
        (error) => {
          console.error('Errore durante la registrazione:', error);
          if (error.error) {
            this.errorMessage = error.error.message || 'Errore durante la registrazione.';
          } else {
            this.errorMessage = 'Errore durante la registrazione.';
          }
        }
      );
    } else {
      this.errorMessage = 'Completa tutti i campi richiesti.';
    }
  }

}

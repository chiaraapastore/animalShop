import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component'; // Importa il componente Login
import { AuthGuard } from './guards/auth.guard'; // Importa l'AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Reindirizza alla Home
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ProductListComponent, canActivate: [AuthGuard] }, // Proteggi questa rotta con il guard
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent }, // Aggiungi la rotta di login
  { path: '**', component: NotFoundComponent } // Fallback per 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

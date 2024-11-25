import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ErrorComponent } from './error/error.component';
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } }, // Proteggi questa rotta per gli amministratori},
  { path: 'shop', component: ProductListComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'confirm-page', component: ConfirmPageComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'user-profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'not-authorized', component: NotFoundComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

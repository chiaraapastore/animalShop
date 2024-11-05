import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path:'', redirectTo: '/home', pathMatch: 'full'},
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

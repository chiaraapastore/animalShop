import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AnnunciComponent } from './annunci/annunci.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChiSiamoComponent } from './chi-siamo/chi-siamo.component';
import { ContattiComponent } from './contatti/contatti.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ProductListComponent },
  { path: 'annunci', component: AnnunciComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'chi-siamo', component: ChiSiamoComponent },
  { path: 'contatti', component: ContattiComponent },
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

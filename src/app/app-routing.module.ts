import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

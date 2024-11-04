import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotesComponent } from './notes/notes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes :Routes = [
  {
    path: 'notes',
    component: NotesComponent
  },/*percorso che si riferisce all'url che digito nel browser ed il componente che viene utilizzato quando viene raggiunto quell'url*/
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: '',
    component: NotesComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path:'about-us',
    component: AboutUsComponent
  },
  {
    path:'contact',
    component: ContactComponent
  },
  {
    path:'cart',
    component: CartComponent
  },
  {
    path:'**',
    component: NotFoundComponent
  }
] /*elenco di rotte*/

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedbackComponent,
    NotesComponent,
    NotFoundComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

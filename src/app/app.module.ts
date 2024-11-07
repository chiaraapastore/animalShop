import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import {FormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({ declarations: [
        AppComponent,
        NavigationComponent,
        FeedbackComponent,
        AnnouncementsComponent,
        HomeComponent,
        AboutUsComponent,
        ContactComponent,
        ProductListComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule], providers: [
        provideClientHydration(),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

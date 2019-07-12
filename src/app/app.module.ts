import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FloorplansComponent } from './floorplans/floorplans.component';
import { ContactComponent } from './contact/contact.component';
import { DevelopmentsComponent } from './developments/development-list/developments.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { OrderComponent } from './order/order.component';
import { SitebuiltComponent } from './floorplans/sitebuilt/sitebuilt.component';
import { ManufacturedComponent } from './floorplans/manufactured/manufactured.component';
import { DetailsComponent } from './floorplans/details/details.component';
import { DevelopmentComponent } from './developments/development/development.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { DevelopmentEditComponent } from './developments/development-edit/development-edit.component';
import { DetailsEditComponent } from './developments/development/details-edit/details-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    FloorplansComponent,
    ContactComponent,
    DevelopmentsComponent,
    PageNotFoundComponent,
    OrderComponent,
    SitebuiltComponent,
    ManufacturedComponent,
    DetailsComponent,
    DevelopmentComponent,
    AuthComponent,
    DevelopmentEditComponent,
    DetailsEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }

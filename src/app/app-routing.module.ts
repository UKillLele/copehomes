import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FloorplansComponent } from './floorplans/floorplans.component';
import { DevelopmentsComponent } from './developments/development-list/developments.component';
import { DevelopmentComponent } from './developments/development/development.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { OrderComponent } from './order/order.component';
import { SitebuiltComponent } from './floorplans/sitebuilt/sitebuilt.component';
import { ManufacturedComponent } from './floorplans/manufactured/manufactured.component';
import { DetailsComponent } from './floorplans/details/details.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { DevelopmentEditComponent } from './developments/development-edit/development-edit.component';
import { DetailsEditComponent } from './developments/development/details-edit/details-edit.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'floorplans', component: FloorplansComponent, children: [
    { path: 'sitebuilt', component: SitebuiltComponent},
    { path: 'manufactured', component: ManufacturedComponent}
  ] },
  { path: 'floorplans/sitebuilt/:name', component: DetailsComponent },
  { path: 'floorplans/manufactured/:name', component: DetailsComponent },
  { path: 'developments', component: DevelopmentsComponent },
  { path: 'developments/:name', component: DevelopmentComponent },
  { path: 'developments/:name/edit/:detailId', component: DetailsEditComponent },
  { path: 'developments/:name/create', component: DetailsEditComponent },
  { path: 'developments/edit/:devId', component: DevelopmentEditComponent },
  { path: 'order', component: OrderComponent },
  { path: 'admin', component: AuthComponent},
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

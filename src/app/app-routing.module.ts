import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TouristPlaceComponent } from './pages/tourist-place/tourist-place-index/tourist-place.component';
import { TouristPlaceViewComponent } from './pages/tourist-place/tourist-place-view/tourist-place-view.component';
import { TouristPlaceCreateComponent } from './pages/tourist-place/tourist-place-create/tourist-place-create.component';
import { TouristPlaceEditComponent } from './pages/tourist-place/tourist-place-edit/tourist-place-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'touristplaces', component: TouristPlaceComponent },
  { path: 'touristplaces/view/:uuid', component: TouristPlaceViewComponent },
  { path: 'touristplaces/create', component: TouristPlaceCreateComponent },
  { path: 'touristplaces/edit/:uuid', component: TouristPlaceEditComponent },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, /**{
      onSameUrlNavigation: "ignore",
      anchorScrolling:'enabled',
      scrollPositionRestoration: 'enabled'
    }*/)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { 
  
}

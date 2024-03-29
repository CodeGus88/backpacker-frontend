import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { MenuComponent } from './components/menu/menu.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TouristPlaceComponent } from './pages/tourist-place/tourist-place-index/tourist-place.component';
import { TouristPlaceViewComponent } from './pages/tourist-place/tourist-place-view/tourist-place-view.component';
import { TouristPlaceCreateComponent } from './pages/tourist-place/tourist-place-create/tourist-place-create.component';
import { TouristPlaceEditComponent } from './pages/tourist-place/tourist-place-edit/tourist-place-edit.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { interceptorProvider } from './interceptors/auth-interceptor.interceptor';
import { RatingComponent } from './components/rating/rating.component';
import { AddressComponent } from './components/address/address-manager/address.component';
import { AddressReadOnlyComponent } from './components/address/address-read-only/address-read-only.component';
import { SharedModule } from './shared/shared.module';
import { ConfirmDialog } from './components/confirm-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ImageDisplayModalComponent } from './components/image-display-modal/image-display-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStarsModule } from 'ngx-stars';
import { RatingFormDialog } from './components/rating/rating-form-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    TouristPlaceComponent,
    TouristPlaceViewComponent,
    TouristPlaceCreateComponent,
    TouristPlaceEditComponent,
    GalleryComponent,
    RatingComponent,
    RatingFormDialog,
    AddressComponent,
    AddressReadOnlyComponent,
    ConfirmDialog,
    NotFoundComponent,
    GalleryComponent,
    ImageDisplayModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    SharedModule,
    NgxStarsModule
  ],
  providers: [interceptorProvider],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

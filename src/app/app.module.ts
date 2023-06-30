import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';

// toast
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { TouristPlaceComponent } from './pages/tourist-place/tourist-place-index/tourist-place.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TouristPlaceViewComponent } from './pages/tourist-place/tourist-place-view/tourist-place-view.component';
import { TouristPlaceCreateComponent } from './pages/tourist-place/tourist-place-create/tourist-place-create.component';
import { TouristPlaceEditComponent } from './pages/tourist-place/tourist-place-edit/tourist-place-edit.component';
import { ImageCropperModule } from 'ngx-image-cropper';
// Multiselect
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { GaleryComponent } from './components/galery/galery.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { interceptorProvider } from './interceptors/auth-interceptor.interceptor';
import { RatingComponent } from './components/rating/rating.component';


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
    GaleryComponent,
    ImageViewerComponent,
    RatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [interceptorProvider],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';

const libs = [
  CommonModule,

  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatSnackBarModule,
  MatDialogModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatTooltipModule
]

@NgModule({
  declarations: [],
  imports: libs,
  exports: libs
})
export class SharedModule {
  
 }

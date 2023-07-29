import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../gallery/gallery.component';

@Component({
  selector: 'app-image-display-modal',
  templateUrl: './image-display-modal.component.html',
  styleUrls: ['./image-display-modal.component.scss']
})
export class ImageDisplayModalComponent {

  constructor(
    protected dialogRef: MatDialogRef<ImageDisplayModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData
  ) {

  }

}

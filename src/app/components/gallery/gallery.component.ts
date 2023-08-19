import { Component, Inject } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, filter, map } from 'rxjs';
import { ImageDisplayModalComponent } from '../image-display-modal/image-display-modal.component';
import { FileGalery, FileRef, GalleryImage } from 'src/app/dtos/gallery/file-galery';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { GalleryService } from 'src/app/services/gallery.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ConfirmDialog } from '../confirm-dialog.component';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { FileUrlGenerator } from '../../constants/files-url';

export interface DialogData {
  urlList: FileRef[];
  position: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {

  protected subscription: Subscription[] = [];
  protected columns = 5;
  protected textInfo: string = 'Cargando...';

  gallery: GalleryImage[] = [];
  protected urlList: FileRef[] = [];
  private files: FileDto[] = [];

  // create
  protected isCreateMode: boolean = false;
  protected file: any;
  // image-cropper
  protected imageChangedEvent: any = '';
  protected croppedImage: any = '';

  constructor(
    protected dialogRef: MatDialogRef<ImageDisplayModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: FileGalery,

    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    private service: GalleryService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.onLoadData();
    this.mediaChange();
  }

  onLoadData(){
    this.service.findByEntityUuid(this.data.eEntity, this.data.entityUuid).subscribe({
      next: data => {
        this.files = data;
        this.loadUrlImages();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  openDialog(position: number): void {
    this.dialog.open(
      ImageDisplayModalComponent,
      {
        data: {
          urlList: this.urlList,
          position: position
        },
        width: '100%',
        height: 'auto'
      }
    );
  }

  private mediaChange(): void {
    this.subscription.push(
      this.mediaObserver.asObservable()
        .pipe(
          filter((changes: MediaChange[]) => changes.length > 0),
          map((changes: MediaChange[]) => changes[0])
        ).subscribe((change: MediaChange) => {
          switch (change.mqAlias) {
            case 'xs': {
              this.columns = 1;
              break;
            }
            case 'sm': {
              this.columns = 2;
              break;
            }
            case 'md': {
              this.columns = 3;
              break;
            }
            case 'lg': {
              this.columns = 5;
              break;
            }
            default: {
              this.columns = 6;
              break;
            }
          }
        })
    );
  }

  // Create new image
  changeMode(isCreateMode: boolean) {
    this.isCreateMode = isCreateMode;
    if (!isCreateMode) {
      this.imageChangedEvent = '';
      this.croppedImage = '';
      this.file = null;
    }
  }
  // Image cropper
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.file = base64ToFile(event.base64!);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  upload() {
    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('parentUuid', this.data.entityUuid ?? '');
    this.service.create(this.data.eEntity!, formData).subscribe({
      next: data => {
        this.snackBar.open("La imagen se subió correctamente", 'ÉXITO', { duration: 3000 });
        let utilFile: FileRef = {
          uuid: data.uuid!,
          url: `${environment.mediaPartialUrl}/${this.data.eEntity}/${this.data.entityUuid}/${data.file}`
        };
        this.urlList.push(utilFile);
        this.changeMode(false);
      },
      error: error => {
        console.log(error);
        this.snackBar.open('Algo salió mal', 'ERROR', { duration: 3000 });
      }
    });
  }

  delete(uuid: string) {
    const dialogRefx = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'CONFIRMACIÓN',
        content: `¿Estás seguro de eliminar la imagen ${uuid}?`
      }
    });
    dialogRefx.afterClosed().subscribe({
      next: confirmation => {
        if (confirmation) {
          this.service.delete(this.data.eEntity, uuid).subscribe({
            next: data => {
              this.snackBar.open('Se eliminó correctamente', "COMPLETADO", { duration: 3000 });
              this.urlList = this.urlList.filter(i => i.uuid !== uuid);
            },
            error: error => {
              console.log(error);
              this.snackBar.open('Algo salió mal', "ERROR", { duration: 3000 });
            }
          });
        }
      }
    });
  }


  // Refactor

  loadUrlImages(): void {
    this.files.forEach(element => {
      if (element.file)
        this.urlList.push({
          uuid: element.uuid!,
          url: FileUrlGenerator.getImageUrl(this.data.eEntity, this.data.entityUuid, element.file)
        });
      else
        this.urlList.push({
          uuid: element.uuid!,
          url: FileUrlGenerator.getDefaultImgUrl(this.data.eEntity)
        });
    });
    if(this.files.length == 0)
      this.textInfo = 'No existen imágenes...';
    else
      this.textInfo = '...';
  }

}

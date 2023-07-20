import { Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { EModule } from 'src/app/enums/e-module.enum';
import { GaleryService } from 'src/app/services/galery/galery.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog.component';

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent {

  imageChangedEvent: any = '';
  inputFile: any = '';
  croppedImage: any = '';
  @ViewChild('btnClose') btnClose!: ElementRef;

  protected file: any;
  protected elementUuid: string;

  // from father
  @Input() eModule: EModule | undefined;
  @Input() eEntity: EEntity | undefined;
  @Input() entityUuid: string | undefined;
  @Input() files?: FileDto[];

  // for father
  // protected files: FileDto[];
  @Output() changeListEvent = new EventEmitter<FileDto[]>();

  showingImg: string = '';

  constructor(
    private service: GaleryService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {
    this.elementUuid = '';
    this.files = [];
  }

  ngOnInit() { }

  private loadFiles() {
    this.service.findByEntityUuid(this.eEntity!, this.entityUuid!).subscribe({
      next: data => {
        this.files = data;
        this.changeListEvent.emit(this.files);
        console.log(data);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.croppedImage = '';
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.file = this.dataURLtoFile(this.croppedImage, 'image.png');
  }

  dataURLtoFile(dataurl: any, filename: any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  clear() {
    this.file = '';
    this.inputFile = '';
    this.croppedImage = '';
    this.imageChangedEvent = '';
  }

  upload() {
    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('parentUuid', this.entityUuid ?? '');
    this.service.upload(this.eEntity!, formData).subscribe({
      next: data => {
        // this.toast.success("La imagen se subió a la galería", "ÉXITO");
        this.snackBar.open("La imagen se subió a la galería", "ÉXITO", {duration: 3000});
        console.log(data);
        this.loadFiles();
        this.clear();
      },
      error: error => {
        console.log(error);
        // this.toast.error("Algo salió mal", "ERROR")
        this.snackBar.open("Algo salió mal", "ERROR", {duration: 3000});
      }
    });

  }

  getImageUrl(image?: string): string {
    return `${environment.mediaPartialUrl}/${this.eEntity!.toLowerCase()}/${this.entityUuid}/${image}`;
  }

  setShowingImg(url: string) {
    this.showingImg = url;
  }

  confirmForDelete(uuid: string) {
    const dialogRefx = this.dialog.open(ConfirmDialog);
    dialogRefx.afterClosed().subscribe(result => {
      if (result) {
        this.delete(uuid);
      }
    });
  }

  delete(uuid: string) {
    this.service.deleteByUuid(this.eEntity!, uuid).subscribe({
      next: data => {
        if (data) {
          this.loadFiles();
          // this.toast.success("Se eliminó con éxito", "ÉXITO");
          this.snackBar.open("Se eliminó con éxito", "ÉXITO", {duration: 3000});
        } else
          // this.toast.error("No se pudo eliminar", "FALLÓ");
          this.snackBar.open("Algo salió mal", "FALLÓ", {duration: 3000});
      },
      error: error => {
        // this.toast.error(error.message, "ERROR");
        this.snackBar.open(error.message, "ERROR", {duration: 3000});
        console.log(error);
      }
    });
  }

}

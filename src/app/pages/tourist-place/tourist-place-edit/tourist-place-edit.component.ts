import { Component } from '@angular/core';
import { Request } from 'src/app/dtos/touristplace/request.dto';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CategoryService } from 'src/app/services/categoriy/category.service';
import { Category } from 'src/app/dtos/category/category.dto';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/components/confirm-dialog.component';

@Component({
  selector: 'app-tourist-place-edit',
  templateUrl: './tourist-place-edit.component.html',
  styleUrls: ['./tourist-place-edit.component.css']
})
export class TouristPlaceEditComponent {

  protected request: Request;
  protected tpDto: TouristPlaceDto;
  protected imageIconUrl: String = '';
  protected imageSelector: String = '';

  protected imgChangeEvt: any = '';
  protected cropImgPreview: any = '';
  protected file: any;

  protected img: any;

  protected errors: any;

  // Multiselect
  protected dropdownList: Category[] = [];
  protected selectedItems: Category[] = [];
  protected dropdownSettings: IDropdownSettings = {};

  // for address child
  protected eEntity = EEntity;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private touristPlaceService: TouristPlaceService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this.request = new Request();
    this.tpDto = new TouristPlaceDto();
    this.tpDto.uuid = this.route.snapshot.params['uuid'];
    this.errors = [];
  }

  ngOnInit() {
    this.multiSelectInit();
    this.categoryService.findAll().subscribe({
      next: data => {
        this.dropdownList = data ?? [];
      },
      error: error => {
        console.log(error);
      }
    });

    this.touristPlaceService.findById(this.tpDto.uuid).subscribe(
      {
        next: data => {
          console.log(data);
          this.loadFormData(data);
        },
        error: e => {
          console.log(e);
          if (e.status = 404)
            this.snackBar.open("No se encontró el recurso " + this.tpDto.uuid, "ERROR " + e.status, {duration: 3000})
          else if (e.status = 400)
            this.snackBar.open("Error en el sistema " + this.tpDto.uuid, "ERROR " + e.status, {duration: 3000})
          else
            this.snackBar.open("Ocurrió un error al cargar el elemento " + this.tpDto.uuid, "ERROR " + e.status, {duration: 3000})
        }
      }
    );
  }

  private loadFormData(data: any) {
    this.tpDto = data;
    this.request.name = data.name;
    this.request.categories = data.categories;
    this.request.description = data.description;
    this.request.imageIcon = data.imageIcon;
    this.request.isPublic = data.isPublic;
    this.request.keywords = data.keywords;
    this.request.resume = data.resume;
    this.imageIconUrl = this.getImageUrl(this.tpDto.uuid, this.tpDto.imageIcon);

    this.selectedItems = data.categories ?? [];
  }

  multiSelectInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      limitSelection: 3
    };
  }

  update(): void {
    this.request.imageIcon = this.tpDto.imageIcon;
    this.request.categories = this.selectedItems.map(e => { return { id: e.id } });

    console.log(this.request);
    this.touristPlaceService.update(this.tpDto.uuid, this.request).subscribe(
      {
        next: data => {
          console.log(data);
          this.snackBar.open("Se guardaron los cambios", "ÉXITO", {duration: 3000})
        },
        error: e => {
          console.log("Código del error: ", e);
          if(e.status = 401)
            this.snackBar.open("No tiene los privilegios para realizar está acción", "SIN PERMISO " + e.status, {duration: 3000})
          else
           this.errors = e.error.errors;
        }
      }
    );
  }

  backHistory() {
    window.history.back();
  }

  upload() {
    let formData = new FormData();
    formData.append('uuid', this.tpDto.uuid!.toString());
    formData.append('file', this.file);
    this.touristPlaceService.updateImageIcon(formData).subscribe({
      next: data => {
        this.loadFormData(data);
        this.imageSelector = '';
        this.imgChangeEvt = '';
        this.cropImgPreview = '';
        this.file = null;
        this.snackBar.open("Se cambio la carátula", "EXITO", {duration: 3000});
      },
      error: error => {
        if(error.status = 401)
          this.snackBar.open("No tiene los privilegios para realizar está acción", "SIN PERMISO", {duration: 3000});
        else
        this.snackBar.open("Algo salió mal", "ERROR", {duration: 3000});
        console.log(error);
      }
    });
  }

  // for image cropper
  onFileChange(event: any): void {
    this.cropImgPreview = '';
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
    this.file = this.dataURLtoFile(this.cropImgPreview, 'image.png');
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

  getImageUrl(uuid?: String, imageIcon?: String): String {
    if (imageIcon)
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/${uuid}/${imageIcon}`;
    else
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/defaultImageIcon.png`;
  }

  deleteImageIcon(): void {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: {name: 'Nombre'}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result.isConfirmed) {
        this.touristPlaceService.removeImageIcon(this.tpDto.uuid ?? '', this.tpDto.imageIcon ?? '').subscribe({
          next: data => {
            this.loadFormData(data);
            this.snackBar.open("La carátula fue eliminada.", "¡Eliminado!", {duration: 3000})
          },
          error: e => {
            if(e.status = 401)
              this.snackBar.open("No tiene los privilegios para realizar está acción", "SIN PERMISO", {duration: 3000})
            else 
              console.log(e);
          }
        });
      }
    });
  }

}

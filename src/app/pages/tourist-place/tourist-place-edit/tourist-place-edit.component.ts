import { Component } from '@angular/core';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/dtos/category/category.dto';
import { environment } from 'src/environments/environment';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/components/confirm-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tourist-place-edit',
  templateUrl: './tourist-place-edit.component.html',
  styleUrls: ['./tourist-place-edit.component.css']
})
export class TouristPlaceEditComponent {

  // protected request: Request;
  protected tpDto: TouristPlaceDto;
  protected imageIconUrl: String = '';
  protected imageSelector: String = '';

  protected imgChangeEvt: any = '';
  protected cropImgPreview: any = '';
  protected file: any;
  protected img: any;
  protected errors: any;

  // Multiselect
  protected categories: Category[] = [];
  protected selectedItems: Category[] = [];

  // for address child
  protected eEntity = EEntity;

  // Formulario
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.minLength(2), Validators.maxLength(35)]],
      imageIcon: [''],
      isPublic: [false],
      categories: [[], [Validators.required, (fc: FormControl) => {
        const value = fc.value;
        if (!Array.isArray(value) || value.length === 0 || value.length > 3) {
          return { multiSelect: true };
        }
      return null;
      }]],
      resume: ['', [Validators.minLength(10), Validators.maxLength(500)]],
      keywords: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10000)]]
  });

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private touristPlaceService: TouristPlaceService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    protected fb: FormBuilder
  ) {
    this.tpDto = new TouristPlaceDto();
    this.tpDto.uuid = this.route.snapshot.params['uuid'];
    this.errors = [];
  }

  ngOnInit() {
    this.categoryService.findAll().subscribe({
      next: data => {
        console.log(data);
        this.categories = data ?? [];
      },
      error: error => {
        console.log(error);
      }
    });

    this.touristPlaceService.findById(this.tpDto.uuid).subscribe(
      {
        next: data => {
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
    let catSelect: any[] = [];
    data.categories.map((item:any) => catSelect.push(item.id));
    data.categories = catSelect;
    this.form.get('name')?.setValue(data.name);
    this.form.get('imageIcon')?.setValue(data.imageIcon);
    this.form.get('isPublic')?.setValue(data.isPublic);
    this.form.get('categories')?.setValue(data.categories);
    this.form.get('resume')?.setValue(data.resume);
    this.form.get('keywords')?.setValue(data.keywords);
    this.form.get('description')?.setValue(data.description);

    this.tpDto = data;
    this.imageIconUrl = this.getImageUrl(this.tpDto.uuid, this.tpDto.imageIcon);

    this.selectedItems = data.categories ?? [];
  }

  update(): void {
    this.touristPlaceService.update(this.tpDto.uuid, this.form.value).subscribe(
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
      }
    });
  }

  // for image cropper
  onFileChange(event: any): void {
    this.cropImgPreview = '';
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.file = base64ToFile(e.base64!);
  }

  getImageUrl(uuid?: String, imageIcon?: String): String {
    if (imageIcon)
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/${uuid}/${imageIcon}`;
    else
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/defaultImageIcon.png`;
  }

  deleteImageIcon(): void {
    const dialogRefx = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'CONFIRMACIÓN',
        content: '¿Estás seguro de eliminar la carátula?',
      }
    });
    dialogRefx.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.touristPlaceService.removeImageIcon(this.tpDto.uuid ?? '', this.tpDto.imageIcon ?? '').subscribe({
            next: data => {
              this.loadFormData(data);
              this.snackBar.open("La carátula fue eliminada.", "ÉXITO", {duration: 3000})
            },
            error: e => {
              if(e.status = 401)
                this.snackBar.open("No tiene los privilegios para realizar está acción", "SIN PERMISO", {duration: 3000})
              else 
                console.log(e);
            }
          });
        }
      }
    });
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EModule } from 'src/app/enums/e-module.enum';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { AddressDto } from 'src/app/dtos/address/address.dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/components/confirm-dialog.component';
import { FileGalery, FileRef } from 'src/app/dtos/gallery/file-galery';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';

@Component({
  selector: 'app-tourist-place-view',
  templateUrl: './tourist-place-view.component.html',
  styleUrls: ['./tourist-place-view.component.css']
})
export class TouristPlaceViewComponent {

  protected punctuation: number = 0;

  public tpDto: TouristPlaceDto;

  // For child galery
  protected uuid: string;
  protected eModule:EModule = EModule.TOURIST_PLACES;
  protected eEntity:EEntity = EEntity.TOURIST_PLACE_FILES;
  // for child image-viewer
  protected clickedImg?: FileDto;

  protected fileGalery: FileGalery | undefined;
  

  // for rating child
  protected eRating = ERating.TOURIST_PLACES_RATING;

  constructor(
    private route: ActivatedRoute, 
    private touristPlaceService: TouristPlaceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ){
    this.uuid = this.route.snapshot.params['uuid'];
    this.tpDto = new TouristPlaceDto();
  }

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData(){
    this.touristPlaceService.findById(this.uuid).subscribe({
      next: data => {
        console.log("data", data);
        this.tpDto = data;
        this.loadUrlImages();
      },
      error: e => {
        console.log(e);
      }
    });
  }
  
  backHistory(){
    window.history.back();
  }

  /**
   * Todos los archivos son las que existen en el lugar turistico
   */
  getImageUrl(file?: String): string {
      return `${environment.mediaPartialUrl}/${this.eEntity.toLowerCase()}/${this.uuid}/${file}`;
  }

  getDefaultImgUrl(): string{
    return `${environment.mediaPartialUrl}/${this.eEntity.toLocaleLowerCase()}/defaultImageIcon.png`;
  }

  deleteByUuid(uuid: String = '') {
    if (!uuid)
      return;
    const dialogRefx = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'CONFIRMACIÓN',
        content: `¿Estás seguro de eliminar el lugar turístico ${uuid}?`
      }
    });
    dialogRefx.afterClosed().subscribe({
      next: result => {
          if (result) {
            this.touristPlaceService.deleteByUuid(uuid).subscribe({
              next: data =>{
                if(data){
                  this.snackBar.open("Se eliminó correctamente.", "¡Eliminado!", {duration: 3000})
                  window.history.back();
                } else
                  this.snackBar.open("No se pudo eliminar el recurso", "RECHAZADO", {duration: 3000})
              },
              error: e => {
                this.snackBar.open(e.message, "ERROR", {duration: 3000})
              }
            });
        }
      }
    });
  }

  format(text: String = ''): String{
    return text.replaceAll('\n', '<br>');
  }

  changeListEvent($files: FileDto[]) {
    this.tpDto.files = $files;
  }

  imgViewer(file?: FileDto){
    if(!file){
      file = new FileDto();
      file.file = this.tpDto.imageIcon?.toString();
      file.entityUuid = this.tpDto.uuid?.toString();
      this.snackBar.open("Carátula del recurso", "CARÁTULA", {duration: 2000});
    }
    this.clickedImg = file;
  }

  refreshPunctuationEvent($event: any){
    this.punctuation = $event;
  }

  getGoogleLink(addressDto: AddressDto): string{
    return `https://maps.google.com/?q=${addressDto.lat},${addressDto.lng}`;
  }

  getGoogleEarth(addressDto: AddressDto): string{
    return `https://earth.google.com/web/@${addressDto.lat},${addressDto.lng}`;
  }

  loadUrlImages(): void{
    let urlList: FileRef [] = [];
    this.tpDto.files.forEach(element => {
      if(element.file)
        urlList.push({
          uuid: element.uuid!,
          url: this.getImageUrl(element.file)
        });
      else
        urlList.push({
          uuid: element.uuid!,
          url: this.getDefaultImgUrl()
        });
    });
    this.fileGalery = {
      eModule: EModule.TOURIST_PLACES,
      eEntity: EEntity.TOURIST_PLACE_FILES,
      entityUuid: this.uuid,
      urlList: urlList,
      writePermission: true
    };
  }

  openGallery(){
    this.dialog.open(GalleryComponent, {
      data: this.fileGalery,
      width: '100%',
      height: 'auto'
    });
  }

  redirectToEdit(){
    this.router.navigate([`/touristplaces/edit/${this.tpDto.uuid}`]);
  }

}
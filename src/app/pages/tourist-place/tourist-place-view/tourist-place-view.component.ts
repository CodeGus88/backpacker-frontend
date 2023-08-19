import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EModule } from 'src/app/enums/e-module.enum';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { AddressDto } from 'src/app/dtos/address/address.dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/components/confirm-dialog.component';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';
import { FileUrlGenerator } from 'src/app/constants/files-url';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription, filter, map } from 'rxjs';
import { TokenService } from 'src/app/auth/services/token.service';
import { EROLE } from 'src/app/auth/enums/role.enum';

@Component({
  selector: 'app-tourist-place-view',
  templateUrl: './tourist-place-view.component.html',
  styleUrls: ['./tourist-place-view.component.css']
})
export class TouristPlaceViewComponent {

  protected isAdmin = false;

  protected gridCols = 2;
  protected ratio: string = '16:9'
  subscription: Subscription[] = [];

  protected imgUrl: string = '';
  protected punctuation: number = 0;

  public tpDto: TouristPlaceDto;

  // For child galery
  protected uuid: string;
  protected eModule:EModule = EModule.TOURIST_PLACES;
  protected eEntity:EEntity = EEntity.TOURIST_PLACE_FILES;
  // for child image-viewer
  protected clickedImg?: FileDto;

  // for rating child
  protected eRating = ERating.TOURIST_PLACES_RATING;

  constructor(
    private route: ActivatedRoute, 
    private touristPlaceService: TouristPlaceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private mediaObserver: MediaObserver,
    private tokenService: TokenService
  ){
    this.uuid = this.route.snapshot.params['uuid'];
    this.tpDto = new TouristPlaceDto();
  }

  ngOnInit() {
    this.onLoadData();
    this.mediaChange();
    this.isAdmin = this.tokenService.hasRole(EROLE.ROLE_ADMIN);
  }

  onLoadData(){
    this.touristPlaceService.findById(this.uuid).subscribe({
      next: data => {
        this.tpDto = data;
        this.imgUrl = this.tpDto.imageIcon?FileUrlGenerator.getImageUrl(this.eEntity, this.uuid, this.tpDto.imageIcon): FileUrlGenerator.getDefaultImgUrl(this.eEntity);
      },
      error: e => {
        console.log(e);
      }
    });
  }
  
  backHistory(){
    window.history.back();
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
              this.gridCols = 1;
              this.ratio = '4:4';
              break;
            }
            case 'sm': {
              this.gridCols = 1;
              this.ratio = '4:3';
              break;
            }
            default: {
              this.gridCols = 2;
              this.ratio = '16:9';
              break;
            }
          }
        })
    );
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

  imgViewer(file?: FileDto){
    if(!file){
      file = new FileDto();
      file.file = this.tpDto.imageIcon?.toString();
      file.entityUuid = this.tpDto.uuid?.toString();
      this.snackBar.open("Carátula del recurso", "CARÁTULA", {duration: 2000});
    }
    this.clickedImg = file;
  }

  refreshPunctuationEvent($event: number){
    this.punctuation = $event;
  }

  getGoogleLink(addressDto: AddressDto): string{
    return `https://maps.google.com/?q=${addressDto.lat},${addressDto.lng}`;
  }

  getGoogleEarth(addressDto: AddressDto): string{
    return `https://earth.google.com/web/@${addressDto.lat},${addressDto.lng}`;
  }

  openGallery(){
    this.dialog.open(GalleryComponent, {
      data: {
            eModule: EModule.TOURIST_PLACES,
            eEntity: EEntity.TOURIST_PLACE_FILES,
            entityUuid: this.uuid,
            writePermission: this.isAdmin
          },
      width: '100%',
      height: 'auto'
    });
  }

  redirectToEdit(){
    this.router.navigate([`/touristplaces/edit/${this.tpDto.uuid}`]);
  }

}
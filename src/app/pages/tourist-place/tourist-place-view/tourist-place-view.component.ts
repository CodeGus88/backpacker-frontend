import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EModule } from 'src/app/enums/e-module.enum';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { RatingComponent } from 'src/app/components/rating/rating.component';

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

  // for rating child
  protected eRating = ERating.TOURIST_PLACES_RATING;

  constructor(
    private route: ActivatedRoute, 
    private touristPlaceService: TouristPlaceService,
    private toast: ToastrService
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
      },
      error: e => {
        console.log(e);
      }
    });
  }
  
  ngBack(){
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
    Swal.fire({
      title: 'CONFIRMACIÓN',
      text: "¿Estás seguro de eliminar este lugar turístico?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ¡Eliminar este recurso!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.touristPlaceService.deleteByUuid(uuid).subscribe(
          {next: data =>{
            if(data){
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              window.history.back();
              
            } else
              this.toast.error("No se pudo eliminar el recurso", "RECHAZADO");
          },
          error: e => {
            this.toast.error("e.message", "ERROR");
          }
        });
      }
    })
  }

  format(text: String = ''): String{
    return text.replaceAll('\n', '<br>');
  }

  showInfo(text: String = "none", title: String = "title"): void{
    this.toast.info(text.toString(), title.toString().toUpperCase());
  }

  changeListEvent($files: FileDto[]) {
    this.tpDto.files = $files;
  }

  imgViewer(file?: FileDto){
    if(!file){
      file = new FileDto();
      file.file = this.tpDto.imageIcon?.toString();
      file.entityUuid = this.tpDto.uuid?.toString();
      this.toast.info("Carátula del recurso", "CARÁTULA");
    }
    this.clickedImg = file;
  }

  refreshPunctuationEvent($event: any){
    this.punctuation = $event;
  }

}
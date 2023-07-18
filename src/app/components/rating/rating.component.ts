import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingRequest } from '../../dtos/rating/request.dto';
import { RatingDto } from 'src/app/dtos/rating/rating.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { RatingService } from 'src/app/services/rating/rating.service';
import { StartsArrayGenerator } from 'src/app/util/stars-array';
import { TokenService } from 'src/app/auth/services/token.service';
import { EROLE } from 'src/app/auth/enums/role.enum';
import { RatingItem } from 'src/app/dtos/rating/item.dto';
// import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
// import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent extends StartsArrayGenerator {

  // inputs
  @Input() eRating?: ERating;
  @Input() entityUuid?: String;

  // outputs
  @Output() punctuationEmiter = new EventEmitter<number>();

  protected ratingRequest?: RatingRequest;
  protected editableItemUuid?: string;
  protected ratingDto?: RatingDto = new RatingDto();
  protected limit = 20;

  constructor(
    private ratingService: RatingService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super(5);
  }

  ngOnInit() {
    this.onLoadRating();
    this.ratingRequest = new RatingRequest(this.entityUuid!.toString());
  }

  onLoadRating(): void {
    this.ratingService.findByEntityUuid(this.eRating!, this.entityUuid!.toString(), this.limit).subscribe({
      next: data => {
        console.log(data);
        let authUserRating = data.items.find(item => item.username == this.tokenService.getUsername());
        if (!authUserRating && data.items.length >= this.limit)
          this.onLoadThisUserRating(data);
        else {
          this.refreshData(data);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onLoadThisUserRating(ratingDto: RatingDto): void {
    this.ratingService.findByEntityUuidAndAuthUserUuid(this.eRating!, this.entityUuid!.toString()).subscribe({
      next: data => {
        ratingDto.items.splice(0, 0, data);
        this.refreshData(ratingDto);
      },
      error: error => {
        console.log(error);
        this.refreshData(ratingDto);
      }
    });
  }

  refreshData(data: RatingDto) {
    this.ratingDto = data;
    this.showRatingForm();
    this.punctuationEmiter.emit(Math.round((this.ratingDto.punctuation! + Number.EPSILON) * 10) / 10);
  }

  showRatingForm(): void {
    let element = this.ratingDto?.items.find(i => i.username === this.tokenService.getUsername());
    if (!element)
      this.ratingRequest = new RatingRequest(this.entityUuid!.toString());
    else
      this.ratingRequest = undefined;
  }

  ratingChanged($event: any) {
    this.ratingRequest!.punctuation = $event.detail;
  }

  isPermited(username: string, verb: string = ''): boolean {
    if (this.tokenService.getUsername() == username || (this.tokenService.hasRole(EROLE.ROLE_ADMIN) && verb.toLowerCase() === 'delete'))
      return true;
    return false;
  }

  create() {
    this.ratingService.create(this.eRating!, this.ratingRequest!).subscribe({
      next: data => {
        console.log(data);
        this.onLoadRating();
        // this.toast.success("Se registro el voto", "ÉXITO");
        this.snackBar.open("Se registro el voto", "ÉXITO", {duration: 3000});
      },
      error: error => {
        console.log(error);
        // this.toast.error(error.error.message, "ERROR " + error.status);
        this.snackBar.open(error.error.message, "ERROR " + error.status, {duration: 3000});
      }
    });
  }

  showEdit(ratingItem?: RatingItem, entityUuid?: string) {
    if (this.ratingRequest) {
      this.showRatingForm();
      this.editableItemUuid = undefined;
    } else {
      // this.ratingRequest = new RatingRequest(this.entityUuid!.toString());
      let request = new RatingRequest(this.entityUuid!.toString());
      request.entityUuid = entityUuid;
      request.comment = ratingItem?.comment!;
      request.punctuation = ratingItem?.punctuation!;
      this.ratingRequest = request;
      this.editableItemUuid = ratingItem?.uuid;
      console.log("editableItemUuid:", this.editableItemUuid);
      console.log("request:", this.ratingRequest);
    }
  }

  update() {
    console.log("ratingRequest:", this.ratingRequest);
    this.ratingService.update(this.eRating!, this.editableItemUuid!, this.ratingRequest!).subscribe({
      next: data => {
        console.log(data);
        this.onLoadRating();
        // this.toast.success("Se guardaron los cambios", "EDITADO");
        this.snackBar.open("Se guardaron los cambios", "EDITADO", {duration: 3000});
      },
      error: error => {
        console.log(error);
        // this.toast.error(error.message, "ERROR");
        this.snackBar.open(error.message, "ERROR", {duration: 3000});
      }
    });
  }

  deleteByUuid(uuid: string) {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: {name: 'Nombre'}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ratingService.deleteByUuid(this.eRating!, uuid).subscribe({
          next: data => {
            if (data) {
              this.onLoadRating();
              this.editableItemUuid = undefined;
              // this.toast.success("Se eliminó correctamente", "ÉXITO")
              this.snackBar.open("Se eliminó correctamente", "ÉXITO", {duration: 3000});
            } else
              // this.toast.error("Algo salió, no se pudo eliminar este recurso", "FALLÓ");
              this.snackBar.open("Algo salió, no se pudo eliminar este recurso", "FALLÓ", {duration: 3000});
          },
          error: e => {
            // this.toast.error(e.message, "ERROR");
            this.snackBar.open(e.message, "ERROR", {duration: 3000});
          }
        });
      }
    });
    
      
  }

}
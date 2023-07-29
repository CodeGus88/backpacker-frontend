import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingDto } from 'src/app/dtos/rating/rating.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { RatingService } from 'src/app/services/rating/rating.service';
import { StartsArrayGenerator } from 'src/app/util/stars-array';
import { TokenService } from 'src/app/auth/services/token.service';
import { EROLE } from 'src/app/auth/enums/role.enum';
import { RatingItem } from 'src/app/dtos/rating/item.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent extends StartsArrayGenerator {

  // inputs
  @Input() eRating?: ERating;
  @Input() entityUuid?: string;

  // outputs
  @Output() punctuationEmiter = new EventEmitter<number>();

  protected showForm?: boolean = false;
  protected editableUuid?: string;
  protected ratingDto?: RatingDto = new RatingDto();
  protected limit = 20;
  protected formGroup: FormGroup;

  constructor(
    private ratingService: RatingService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    super(5);
    this.formGroup = this.fb.group({
      punctuation: [0, [Validators.min(1), Validators.max(5)]],
      comment: [''],
      entityUuid: [this.entityUuid, [Validators.required]]
    });
  }

  ngOnInit() {
    this.onLoadRating();
  }

  private onLoadRating(): void {
    this.ratingService.findByEntityUuid(this.eRating!, this.entityUuid!, this.limit).subscribe({
      next: data => {
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

  private onLoadThisUserRating(ratingDto: RatingDto): void {
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

  private refreshData(data: RatingDto): void {
    this.ratingDto = data;
    this.showRatingForm();
    this.punctuationEmiter.emit(Math.round((this.ratingDto!.punctuation! + Number.EPSILON) * 10) / 10);
  }

  private showRatingForm(): void {
    let element = this.ratingDto?.items.find(i => i.username === this.tokenService.getUsername());
    this.showForm = element==undefined?true:false;
    if (!element){
      // this.ratingRequest = new RatingRequest(this.entityUuid!.toString());
      this.showForm = true;
    }else{
      // this.ratingRequest = undefined;
      this.showForm = false;
    }
  }

  ratingChanged($event: any) {
    // this.ratingRequest!.punctuation = $event.detail;
    this.formGroup.get('punctuation')?.patchValue($event.detail);
  }

  isPermited(username: string, verb: string = ''): boolean {
    if (this.tokenService.getUsername() == username || (this.tokenService.hasRole(EROLE.ROLE_ADMIN) && verb.toLowerCase() === 'delete'))
      return true;
    return false;
  }

  onSubmit(){
    if(!this.editableUuid)
      this.create()
    else if(this.editableUuid)
      this.update();
  }

  create() {
    this.ratingService.create(this.eRating!, this.formGroup.value).subscribe({
      next: data => {
        console.log(data);
        this.onLoadRating();
        this.snackBar.open("Se registro el voto", "ÉXITO", {duration: 3000});
      },
      error: error => {
        console.log(error);
        this.snackBar.open(error.error.message, "ERROR " + error.status, {duration: 3000});
      }
    });
  }

 update() {
    this.ratingService.update(this.eRating!, this.editableUuid!, this.formGroup.value).subscribe({
      next: data => {
        console.log(data);
        this.onLoadRating();
        this.snackBar.open("Se guardaron los cambios", "EDITADO", {duration: 3000});
      },
      error: error => {
        console.log(error);
        this.snackBar.open(error.message, "ERROR", {duration: 3000});
      }
    });
  }

  showEdit(ratingItem?: RatingItem, entityUuid?: string) {
    if (this.editableUuid) {
      this.showRatingForm();
      this.editableUuid = undefined;
    } else {
      this.formGroup.patchValue({
        comment: ratingItem?.comment,
        punctuation: ratingItem?.punctuation,
        entityUuid: entityUuid
      });
      this.editableUuid = ratingItem?.uuid;
    }
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
              this.editableUuid = undefined;
              this.snackBar.open("Se eliminó correctamente", "ÉXITO", {duration: 3000});
            } else
              this.snackBar.open("Algo salió, no se pudo eliminar este recurso", "FALLÓ", {duration: 3000});
          },
          error: e => {
            this.snackBar.open(e.message, "ERROR", {duration: 3000});
          }
        });
      }
    });
  }

}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingDto } from 'src/app/dtos/rating/rating.dto';
import { ERating } from 'src/app/enums/rating.enum';
import { RatingService } from 'src/app/services/rating/rating.service';
import { TokenService } from 'src/app/auth/services/token.service';
import { EROLE } from 'src/app/auth/enums/role.enum';
import { RatingItem } from 'src/app/dtos/rating/item.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog.component';
import { RatingFormDialog } from './rating-form-dialog.component';

export interface FormData {
  punctuation: number;
  comment: string;
  entityUuid: string;
}

export interface Data {
  eRating?: ERating;
  editableUuid?: string | undefined;
  formData: FormData
}

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  // inputs
  @Input() eRating?: ERating;
  @Input() entityUuid?: string;

  // outputs
  @Output() punctuationEmiter = new EventEmitter<number>();

  protected ratingDto: RatingDto;

  protected limit: number = 20;

  @Output() private data = new EventEmitter<number>();

  constructor(
    private ratingService: RatingService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.ratingDto = new RatingDto();
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
        this.data.emit(data.punctuation);
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
    this.punctuationEmiter.emit(Math.round((this.ratingDto!.punctuation! + Number.EPSILON) * 10) / 10);
  }

  isPermited(username: string | undefined, verb: string = ''): boolean {
    if (username && (this.tokenService.getUsername() == username || (this.tokenService.hasRole(EROLE.ROLE_ADMIN) && verb.toLowerCase() === 'delete')))
      return true;
    else if(verb.toLowerCase() == 'create'){
      let isLoguet: boolean = this.tokenService.isLogged();
      let containsCommentForUser: boolean = this.ratingDto?.items.findIndex(item => item.username == this.tokenService.getUsername()) > -1;
      if(isLoguet && !containsCommentForUser)
        return true;
    }
    return false;
  }

  deleteByUuid(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: 'CONFIRMACIÓN', content: 'Se eliminará la puntuación, ¿Quieres continuar?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ratingService.deleteByUuid(this.eRating!, uuid).subscribe({
          next: data => {
              this.onLoadRating();
              this.snackBar.open("Se eliminó correctamente", "ÉXITO", { duration: 3000 });
          },
          error: e => {
            this.snackBar.open(e.message, "ERROR", { duration: 3000 });
          }
        });
      }
    });
  }

  openFormDialog(ratingItem?: RatingItem): void {
    let data: Data = {
      editableUuid: ratingItem?.uuid,
      eRating: this.eRating,
      formData: {
        comment: ratingItem?.comment ?? '',
        punctuation: ratingItem?.punctuation ?? 0,
        entityUuid: this.ratingDto!.entityUuid!
      }
    };
    const dialogRef = this.dialog.open(RatingFormDialog, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data.editableUuid) {
          let index: number = this.ratingDto.items.findIndex(item => item.uuid === result.uuid);
          if(index > -1){
            Object.assign(this.ratingDto!.items[index], result);
            this.updatePunctuation();
          }
        } else {
          this.ratingDto?.items.push(result);
          this.updatePunctuation();
        }
      }
    })
  }

  private updatePunctuation(){
    this.ratingService.punctuationByentityUuid(this.eRating!, this.entityUuid!).subscribe(
      result => {
        console.log(result);
        this.ratingDto.punctuation = result.population;
        this.ratingDto.punctuation = result.punctuation;
        this.data.emit(result.punctuation);
      }
    );
  }

}
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Data } from './rating.component';
import { RatingService } from "src/app/services/rating/rating.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'rating-form-dialog',
    template: `
        <div class="m-3">
            <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
                <mat-form-field  hintLabel="Max 255 characters" class="col-12">
                    <mat-label>Comentario</mat-label>
                    <textarea matInput 
                        placeholder="Describe tu experiencia y el porque de la puntuación" 
                        formControlName="comment" rows="5"
                        maxlength="255" autocomplete="off"></textarea>
                    <mat-hint align="end">{{formGroup.get('comment')!.value.length}}/255</mat-hint>
                </mat-form-field>

                <div class="stars-container">
                    <ngx-stars 
                    color="yellow"
                    [initialStars]="formGroup.get('punctuation')!.value"
                    [size]="3" 
                    [animation]="formGroup.get('punctuation')!.value==0" 
                    (ratingOutput)="ratingChanged($event)">
                    </ngx-stars>
                </div>
                <div class="row justify-content-between m-3">
                    <button mat-raised-button class="col-5" type="button" (click)="cancel()">Cancelar</button>
                    <button mat-raised-button class="col-5" 
                        type="submit" [disabled]="!formGroup.valid">
                        {{data.editableUuid?'Actualizar':'Enviar'}}
                    </button>
                </div>    
            </form>
        </div>
    `,
    styleUrls: ['./rating.component.css']
})
export class RatingFormDialog {

    protected formGroup: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<RatingFormDialog>,
        @Inject(MAT_DIALOG_DATA) protected data: Data,
        private formBuilder: FormBuilder,
        private ratingService: RatingService,
        private snackBar: MatSnackBar
    ) {
        console.log(this.data);
        this.formGroup = this.formBuilder.group({
            comment: [this.data.formData?.comment ?? ''],
            punctuation: [this.data.formData!.punctuation ?? 0, [Validators.min(0.5), Validators.max(5)]],
            entityUuid: [this.data.formData!.entityUuid ?? '', [Validators.required]]
        });
        console.log(this.formGroup.value);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ratingChanged(punctuation: number) {
        this.formGroup.get('punctuation')?.setValue(punctuation);
    }

    onSubmit() {
        if (!this.data.editableUuid)
            this.create();
        else
            this.update();
    }

    create() {
        this.ratingService.create(this.data.eRating!, this.formGroup.value).subscribe({
            next: data => {
                this,this.dialogRef.close(data);
                this.snackBar.open("Se registro el voto", "ÉXITO", { duration: 3000 });
            },
            error: error => {
                console.log(error);
                if(error.status == 409)
                    this.snackBar.open(error.error.message, "ERROR " + error.status, { duration: 3000 });
                else
                    this.snackBar.open("algo salió mal", "ERROR", {duration: 3000});
            }
        });
    }

    update() {
        if(!this.data.editableUuid)
            return;
        this.ratingService.update(this.data.eRating!, this.data.editableUuid!, this.formGroup.value).subscribe({
            next: data => {
                console.log(data);
                this,this.dialogRef.close(data);
                this.snackBar.open("Se guardaron los cambios", "ACTUALIZADO", { duration: 3000 });
            },
            error: error => {
                console.log(error);
                this.snackBar.open(error.message, "ERROR", { duration: 3000 });
            }
        });
    }

    protected cancel() {
        this.dialogRef.close();
    }

}
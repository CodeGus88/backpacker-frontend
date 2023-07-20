import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  template: `
    <h1 mat-dialog-title>{{title??'CONFIRM'}}</h1>
    <div mat-dialog-content>
      <p>{{content??'Continue?'}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="cancel()">{{cancelButtonText??'Cancel'}}</button>
      <button mat-button (click)="accept()" color="warn" [mat-dialog-close]="true" cdkFocusInitial>{{acceptButtonText??'yes'}}</button>
    </div>
  `,
  styles: [`
    /* confirm dialog */
    .confirm-dialog .mat-dialog-container{
        z-index: 10000;
    }
  `]
})
export class ConfirmDialog {

  @Input() title: string | undefined;
  @Input() content: string | undefined;
  @Input() acceptButtonText: string | undefined;
  @Input() cancelButtonText: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>
  ) {}

  cancel() {
    this.dialogRef.close(false);
  }

  accept() {
    this.dialogRef.close(true);
  }

}
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  template: `
    <h1 mat-dialog-title>{{data.title??'CONFIRM'}}</h1>
    <div mat-dialog-content>
      <p>{{data.content??'Continue?'}}</p>
    </div>
    <div mat-dialog-actions class="m-3">
      <button mat-button (click)="cancel()">{{data.btnCancel??'Cancel'}}</button>
      <button mat-button (click)="accept()" color="warn" [mat-dialog-close]="true" cdkFocusInitial>{{data.btnAcept??'yes'}}</button>
    </div>
  `,
  styles: []
})
export class ConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() {
    this.dialogRef.close(false);
  }

  accept() {
    this.dialogRef.close(true);
  }

}
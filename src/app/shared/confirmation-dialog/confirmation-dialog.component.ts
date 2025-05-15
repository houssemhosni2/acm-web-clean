import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.sass']
})
export class ConfirmationDialogComponent {

  /**
   * constructor
   * @param dialogRef MatDialogRef<ConfirmationDialogComponent>
   * @param data string
   * @param translate TranslateService
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {button_non: string, message: string}, public translate: TranslateService) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
}

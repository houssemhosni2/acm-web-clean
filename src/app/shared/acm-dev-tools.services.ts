import { Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
/**
 * Commun services devtools
 */
export class AcmDevToolsServices {
  options: GlobalConfig;
  types = [
    'success',
    'error',
    'info',
    'warning'
  ];
  lastInserted: number[] = [];
  messages = '';
  /**
   * constructor
   * @param toastr ToastrService
   * @param translate TranslateService
   * @param router Router
   * @param dialog MatDialog
   */
  constructor(public toastr: ToastrService,
              public translate: TranslateService,
              public router: Router,
              public dialog: MatDialog) {
    this.options = this.toastr.toastrConfig;
  }

  /**
   * Back Top page
   */
  backTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * notification
   * index : {
   * 0 : success ,
   * 1 : error ,
   * 2 : info ,
   * 3 : warning }
   */
  openToast(index, alertMessage) {

    this.options.preventDuplicates = true;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;
    this.options.closeButton = true;

    this.translate.get(alertMessage).subscribe((value) => {
      const message = value;
      const title = this.types[index];
      // Clone current config so it doesn't change when ngModel updates
      const opt = cloneDeep(this.options);
      const inserted = this.toastr.show(
        message,
        title,
        opt,
        this.options.iconClasses[this.types[index]],
      );
      if (inserted) {
        this.lastInserted.push(inserted.toastId);
      }
      return inserted;
    });
  }
  /**
   * toast
   * @param index index
   * @param alertMessages aray of messages
   * @returns toast
   */
  async openToastArrayMessages(index, alertMessages: Array<any>) {
    this.messages = '';

    this.options.preventDuplicates = true;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;
    // translate messages
    await alertMessages.forEach((element) => {
      this.translate.get('error.' + element).subscribe((value) => {
        this.messages = this.messages + value + ', ';
      });
    });
    const title = this.types[index];
    const opt = cloneDeep(this.options);
    const inserted = this.toastr.show(
      this.messages,
      title,
      opt,
      this.options.iconClasses[this.types[index]],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  /**
   * show the max Image size
   * index : {
   * 0 : success ,
   * 1 : error ,
   * 2 : info ,
   * 3 : warning }
   */
  openToastForMaxSizeImg(index, alertMessage, maxSize) {

    this.options.preventDuplicates = true;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;

    this.translate.get(alertMessage).subscribe((value) => {
      const message = value + ' ' + maxSize + ' kiloBytes';
      const title = this.types[index];
      // Clone current config so it doesn't change when ngModel updates
      const opt = cloneDeep(this.options);
      const inserted = this.toastr.show(
        message,
        title,
        opt,
        this.options.iconClasses[this.types[index]],
      );
      if (inserted) {
        this.lastInserted.push(inserted.toastId);
      }
      return inserted;
    });
  }
  /**
   *
   * @param index number
   * @param alertMessage string
   * @param guarantorName string
   */
  openToastWithCustomerName(index, alertMessage, guarantorName) {

    this.options.preventDuplicates = false;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;

    this.translate.get(alertMessage).subscribe((value) => {
      let name: string[];
      name = guarantorName.split('|', 4);
      const message = name[0] + ' ' + name[1] + ' ' + name[2] + ' ' + name[3] + ': ' + value;
      const title = this.types[index];
      // Clone current config so it doesn't change when ngModel updates
      const opt = cloneDeep(this.options);
      const inserted = this.toastr.show(
        message,
        title,
        opt,
        this.options.iconClasses[this.types[index]],
      );
      if (inserted) {
        this.lastInserted.push(inserted.toastId);
      }
      return inserted;
    });
  }
  /**
   * toast with parameter inserted (parameter set from the file.ts and not from i18n)
   * @param index index
   * @param alertMessages array of messages
   * @param parameter parameter to put in the toast
   * @returns toast
   */
  async openToastArrayMessagesWithParameterInMiddle(index, alertMessages: Array<any>, parameter?: string) {
    this.messages = '';
    let insertParameter = true;

    this.options.preventDuplicates = true;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;
    // translate messages
    await alertMessages.forEach((element) => {
      this.translate.get('alert.' + element).subscribe((value) => {
        this.messages = this.messages + ' ' + value + ' ';
      });
      // insert parameter only after the first element
      if (insertParameter) {
        insertParameter = false;
        this.messages = this.messages + parameter;
      }
    });
    const title = this.types[index];
    const opt = cloneDeep(this.options);
    const inserted = this.toastr.show(
      this.messages,
      title,
      opt,
      this.options.iconClasses[this.types[index]],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }

  /**
   *
   * @param index number
   * @param alertMessage string
   * @param parameter string
   */
  openToastWithParameter(index, alertMessage, parameter) {

    this.options.preventDuplicates = false;
    this.options.countDuplicates = true;
    this.options.resetTimeoutOnDuplicate = true;

    this.translate.get(alertMessage).subscribe((value) => {
      const message = value + parameter;
      const title = this.types[index];
      // Clone current config so it doesn't change when ngModel updates
      const opt = cloneDeep(this.options);
      const inserted = this.toastr.show(
        message,
        title,
        opt,
        this.options.iconClasses[this.types[index]],
      );
      if (inserted) {
        this.lastInserted.push(inserted.toastId);
      }
      return inserted;
    });
  }

  /**
   * Methode openConfirmationDialog
   */
  openConfirmationDialog(msg, navigation, parametres?: string[], buttonNon?: boolean) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      autoFocus: true,
      data: {
        message: 'confirmation_dialog.' + msg,
        button_non: buttonNon
      },

    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (!parametres) {
          this.router.navigate([navigation]);
        } else {
          const params = parametres[0];
          const value = parametres[1];
          this.router.navigate([navigation], { queryParams: { [params]: value } });
        }
      }
    }
    );
  }

  /**
   * Methode openConfirmDialog
   */
  openConfirmDialogWithoutRedirect(msg) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg
      }
    });
  }

  /**
   * Methode getDecimalPlaces
   */
  getDecimalPlaces(currencyDecimalPlaces) {
    return '1.' + currencyDecimalPlaces + '-' + currencyDecimalPlaces;
  }

  /**
   * make Form As Touched
   * @param from FormGroup
   */
  makeFormAsTouched(from: FormGroup) {
    (Object as any).values(from.controls).forEach(control => {
      control.markAsTouched(true);
      control.markAsDirty(true);
    });
  }
  /**
   * make Form As not Touched
   * @param from FormGroup
   */
  makeFormAsNotTouched(from: FormGroup) {
    (Object as any).values(from.controls).forEach(control => {
      control.markAsUnTouched();
    });
  }
  findFormControlWithValue(code,form : FormGroup) {
    const formControls = Object.values(form.controls);

       for (let i = 0; i < formControls.length; i++) {
      if (formControls[i].value.code === code) {
        return i;
      }
    }

    return null;
  }
  /**
   * Methode Invalid Form Control
   */
  public InvalidControl() {
    const InvalidControl: HTMLElement = document.querySelector('form .ng-invalid');
    if (InvalidControl) {
      InvalidControl.focus();
      InvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

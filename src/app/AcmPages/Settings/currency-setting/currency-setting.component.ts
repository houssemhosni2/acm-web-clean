import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmCurrencySetting } from 'src/app/shared/Entities/acmCurrencySetting.entity';
import { customRequiredValidator } from 'src/app/shared/utils';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-currency-setting',
  templateUrl: './currency-setting.component.html',
  styleUrls: ['./currency-setting.component.sass']
})

export class CurrencySettingComponent implements OnInit {

  public groupForm: FormGroup;
  public currencySetting: AcmCurrencySetting;
  public currencyList: AcmCurrencySetting[];

  public pageSize: number;
  public page: number;

  public action: string = "create";


  constructor(public translate: TranslateService, public library: FaIconLibrary, public modal: NgbModal,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public settingService: SettingsService
  ) { }

  ngOnInit(): void {

    this.pageSize = 5;
    this.page = 1;
    this.settingService.findCurrencySetting(new AcmCurrencySetting()).subscribe((res)=>{
      this.currencyList = res;
    })
  
  }

  closeModale() {
    this.modal.dismissAll();
  }

  onSubmit(){
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      this.currencySetting.code = this.groupForm.controls.code.value;
      this.currencySetting.description = this.groupForm.controls.description.value;
      this.currencySetting.symbol = this.groupForm.controls.symbol.value;
      this.currencySetting.decimalPlaces = this.groupForm.controls.decimalPlaces.value;
      this.currencySetting.rounding = this.groupForm.controls.rounding.value;
      this.currencySetting.active = this.groupForm.controls.active.value;
      this.currencySetting.roundDecimal = this.groupForm.controls.roundDecimal.value;
      this.settingService.saveCurrencySetting(this.currencySetting).subscribe((res)=> {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
      
    }
  }

  addCurrency(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.currencySetting = new AcmCurrencySetting();
    this.currencySetting.active = false ;
    this.createForm(this.currencySetting);
    this.modal.open(modalContent);
  }

  editCurrency(modalContent: TemplateRef<any>, currencySetting: AcmCurrencySetting){
    this.action = "update";
    this.currencySetting = currencySetting;
    this.createForm(currencySetting);
    this.modal.open(modalContent);
  }

  disableCurrency(currencySetting: AcmCurrencySetting){
    this.currencySetting = currencySetting;
    this.currencySetting.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('setting.currency-setting.delete-currency-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingService.saveCurrencySetting(this.currencySetting).subscribe((res)=> {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }

  createForm(currencySetting: AcmCurrencySetting) {
    this.groupForm = this.formBuilder.group({
      code: [currencySetting.code, [customRequiredValidator]],
      description: [currencySetting.description, [customRequiredValidator]],
      symbol: [currencySetting.symbol, [customRequiredValidator]],
      decimalPlaces: [currencySetting.decimalPlaces, [customRequiredValidator]],
      roundDecimal: [currencySetting.roundDecimal, [customRequiredValidator]],
      rounding: [currencySetting.rounding, [customRequiredValidator]],
      active: [currencySetting.active],
    });
  }


  getDirection() {
    return AppComponent.direction;
  }

  endableDisable(currencySetting: AcmCurrencySetting) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_journal_entry_type').afterClosed().
      subscribe(res => {
        if (res) {

          this.settingService.saveCurrencySetting(currencySetting).subscribe((res)=> {
            this.devToolsServices.openToast(0, 'alert.success');
            this.modal.dismissAll();
            this.ngOnInit();
          })

        } else {
          currencySetting.enabled = !currencySetting.enabled;
        }
      });
  }

}

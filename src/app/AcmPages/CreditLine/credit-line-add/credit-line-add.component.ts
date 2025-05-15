import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../Settings/settings.service';
import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from "primeng/api";
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { creditLineEntity } from 'src/app/shared/Entities/AcmCreditLine.entity';
import { toppedUpHistoryEntity } from 'src/app/shared/Entities/AcmToppedUpHistory.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CreditLineService } from '../credit-line.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {customRequiredValidator} from '../../../shared/utils';

@Component({
  selector: 'app-credit-line-add',
  templateUrl: './credit-line-add.component.html',
  styleUrls: ['./credit-line-add.component.sass']
})
export class CreditLineAddComponent implements OnInit {

  public thirdPartyList: SettingThirdPartyEntity[] = [];
  public productEntitys: ProductEntity[] = [];
  public formCreditLine: FormGroup;
  public selectedProducts: SelectItem[] = [];
  public displayMultiSelect: boolean = false;
  public creditLine: creditLineEntity = new creditLineEntity();
  public toppedUpHistories: toppedUpHistoryEntity[] = [];
  public toppedUpHistory: toppedUpHistoryEntity = new toppedUpHistoryEntity();
  public currentUser: UserEntity;
  public updateCreditLine: creditLineEntity = new creditLineEntity();
  public formLoaded = new Subject<boolean>();
  public toppedUpHistoriesToRemove: toppedUpHistoryEntity[] = [];
  
  public  decimalRegex = /^[0-9]{1,11}(\.[0-9]{0,4})?$/;


  constructor(public settingsService: SettingsService, private fb: FormBuilder,
    public devToolsServices: AcmDevToolsServices, public sharedService: SharedService,
    public creditLineService: CreditLineService, public router: Router,
    public activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.formLoaded.next(false);
    const settingThirdPartyEntity: SettingThirdPartyEntity = new SettingThirdPartyEntity();
    settingThirdPartyEntity.type = AcmConstants.PARTY_TYPE_FINANCIAL_BACKER;
    await this.settingsService.getThirdPartysByParms(settingThirdPartyEntity).toPromise().then((data) => {
      this.thirdPartyList = data;
    })

    await this.settingsService.findAllProduct().toPromise().then((data) => {
      this.productEntitys = data;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.source === 'ADD') {
        this.updateCreditLine = null;
      }
      else if (params.source === 'EDIT') {
        this.updateCreditLine = this.sharedService.getCreditLine();
      }
    });

    if (this.updateCreditLine?.expiryDate) {
      this.updateCreditLine.expiryDate = new Date(this.updateCreditLine?.expiryDate).toISOString().split('T')[0];
    }
    if (this.updateCreditLine?.issueDate) {
      this.updateCreditLine.issueDate = new Date(this.updateCreditLine?.issueDate).toISOString().split('T')[0];
    }

    this.formCreditLine = this.fb.group({
      fundName: [this.updateCreditLine?.fundName, [customRequiredValidator]],
      description: [this.updateCreditLine?.description, [customRequiredValidator]],
      balance: [this.updateCreditLine?.balance],
      controlBalance: [this.updateCreditLine?.controlBalance],
      fundPriority: [this.updateCreditLine?.fundPriority, [customRequiredValidator]],
      issueDate: [this.updateCreditLine?.issueDate, [customRequiredValidator]],
      expiryDate: [this.updateCreditLine?.expiryDate, [customRequiredValidator]],
      thirdParty: [this.updateCreditLine?.thirdParty.id, [customRequiredValidator]],
      products: [this.updateCreditLine?.products, [customRequiredValidator]],
      toppedUpAmount: [0, [customRequiredValidator,Validators.pattern(this.decimalRegex)]],
      remainingBalance: [this.updateCreditLine?.remainingBalance]
    })

    this.getConnectedUser();

    this.formLoaded.next(true);
  }

  compareProducts(product1: any, product2: any): boolean {
    return product1 && product2 ? product1.id === product2.id : product1 === product2;
  }
  getConnectedUser() {
    this.currentUser = this.sharedService.getUser();
  }

  createCreditLine() {
    this.devToolsServices.makeFormAsTouched(this.formCreditLine);
    if (this.formCreditLine.valid) {

      // Credit line
      this.creditLine.fundName = this.formCreditLine.controls.fundName.value;
      this.creditLine.description = this.formCreditLine.controls.description.value;
      this.creditLine.balance = this.formCreditLine.controls.balance.value + this.formCreditLine.controls.toppedUpAmount.value;
      this.creditLine.controlBalance = (this.formCreditLine.controls.controlBalance.value) ?
        this.formCreditLine.controls.controlBalance.value : false;
      this.creditLine.fundPriority = this.formCreditLine.controls.fundPriority.value;
      this.creditLine.issueDate = this.formCreditLine.controls.issueDate.value;
      this.creditLine.expiryDate = this.formCreditLine.controls.expiryDate.value;
      let thirdParty = this.thirdPartyList.filter((item) => item.id === this.formCreditLine.controls.thirdParty.value)[0];
      this.creditLine.thirdParty = thirdParty;
      this.creditLine.products = this.formCreditLine.controls.products.value;
      this.creditLine.enabled = true;

      // add topped up history
      if (this.formCreditLine.controls.toppedUpAmount.value != 0) {
        this.toppedUpHistory.amount = this.formCreditLine.controls.toppedUpAmount.value;
        this.toppedUpHistory.issueDate = this.formCreditLine.controls.issueDate.value;
        this.toppedUpHistory.updatedBy = this.currentUser.fullName;
        this.toppedUpHistory.dateLastUpdate = new Date();
        this.toppedUpHistory.enabled = true;
        // add topped up history
        this.toppedUpHistories.push(this.toppedUpHistory);
      }



      this.creditLine.toppedUpHistories = this.toppedUpHistories;

      if (this.updateCreditLine) {
        this.creditLine.id = this.updateCreditLine.id;
      }

      this.creditLineService.createCreditLine(this.creditLine).subscribe((res) => {

        if (this.toppedUpHistoriesToRemove.length > 0) {
          this.toppedUpHistoriesToRemove.map((toppedUpHistory) => toppedUpHistory.creditLine = this.updateCreditLine)
          this.creditLineService.deleteToppedUpHistory(this.toppedUpHistoriesToRemove).subscribe((res) => { })
        }

        this.sharedService.resetCreditLine();
        this.devToolsServices.openToast(0, 'alert.success');
        this.router.navigate(['/acm/list-credit-line']);
      })

    }
  }

  exit() {
    this.router.navigate(['/acm/list-credit-line']);
  }

  deleteToppedUpHistory(i) {
    // Remove the deleted amount from balance
    const newBalance = this.formCreditLine.controls.balance.value - this.updateCreditLine.toppedUpHistories[i].amount;
    this.formCreditLine.controls.balance.setValue(newBalance);

    this.toppedUpHistoriesToRemove.push(this.updateCreditLine?.toppedUpHistories[i]);
    this.updateCreditLine?.toppedUpHistories.splice(i, 1);
  }

  dateChanged() {
    if ((this.formCreditLine.controls['issueDate'].value !== '') &&
      (this.formCreditLine.controls['expiryDate'].value !== '') &&
      (this.formCreditLine.controls['issueDate'].value > this.formCreditLine.controls['expiryDate'].value)) {
      this.devToolsServices.openToast(3, 'alert.eror-issue-date');
    }
  }
 submit(){
  this.validateForm();
  this.createCreditLine();
 }
 validateForm() {
  Object.values(this.formCreditLine.controls).forEach((control: AbstractControl) => {
    control.markAsTouched();
    control.updateValueAndValidity();
   });
  }
}

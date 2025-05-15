import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
import { SettingsService } from '../../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AddressListEntity } from 'src/app/shared/Entities/AddressList.entity';
import { AddressSettingEntity } from 'src/app/shared/Entities/AddressSetting.entity';
import { CustomerAddressService } from 'src/app/AcmPages/Customer/customer-address/customer-address.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from "rxjs";
import { UdfStepWorkflowComponent } from 'src/app/AcmPages/Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { GenericWorkFlowDocumentComponent } from 'src/app/AcmPages/generic-workFlow/generic-work-flow-screen/generic-workFlow-document/generic-workFlow-document.component';
import { ElementId } from 'src/app/shared/Entities/elementId.entity';
import {customRequiredValidator,customEmailValidator,customPatternValidator} from '../../../../shared/utils';

@Component({
  selector: 'app-add-setting-third-party',
  templateUrl: './add-setting-third-party.component.html',
  styleUrls: ['./add-setting-third-party.component.sass']
})

export class AddSettingThirdPartyComponent implements OnInit {
  public thirdPartyforUpdate: SettingThirdPartyEntity = new SettingThirdPartyEntity();
  public groupForm: FormGroup;
  public thirdPartySetting = true;
  public emailMask = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);

  countryList: AddressListEntity[] = [];
  regionList: AddressListEntity[] = [];
  country: AddressListEntity;
  region: AddressListEntity;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  @ViewChild(GenericWorkFlowDocumentComponent)
  genericWorkFlowDocumentComponent: GenericWorkFlowDocumentComponent;
  public elementId : ElementId = new ElementId() ;
  source  : string  ;


  addressList: string[] = [];
  addressListEntity: AddressListEntity[] = [];
  private navigationSubscription: Subscription;

  constructor(public customerAddressService: CustomerAddressService, private settingsService: SettingsService, public translate: TranslateService,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public router: Router, public activatedRoute: ActivatedRoute,
    public sharedService: SharedService) { }

  async ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ResetForm();
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.source = params.source ;
      if (params.source === 'ADD') {
        this.thirdPartyforUpdate = null;
        this.elementId.thirdPartyId =  0 ;
        this.sharedService.setElementId(this.elementId) ;
      }
      else if (params.source === 'EDIT') {
        this.thirdPartyforUpdate = this.sharedService.getThirdParty();
        this.elementId.thirdPartyId =  this.thirdPartyforUpdate.id ;
        this.sharedService.setElementId(this.elementId) ;
      }
    });
    // Edit case
    if (this.thirdPartyforUpdate !== null) {
      this.editParty()
    }
    // Add case
    else {
      this.addParty()
    }
  }

  async addParty() {
    if (this.countryList.length === 0) {
      // Get country
      this.customerAddressService.getAddressList(this.addressList).subscribe(
        (data) => {
          this.addressListEntity = data;
          this.addressListEntity.forEach(list => {
            // Get Addres List for Parent Id = 0
            if (list.parentAddressListID === 0) {
              const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
              addressSettingEntity.addressListId = list.addressListID;
              this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                (result) => {
                  this.countryList = result.filter((item)=> item.name !=="ETRANGER");
                });
            }
        });
      });
    }
    await this.createForm(this.thirdPartyforUpdate);
  }


  async editParty() {
    if (this.countryList.length === 0) {

      this.customerAddressService.getAddressList(this.addressList).toPromise().then(
        (data) => {
          this.addressListEntity = data;
          this.addressListEntity.forEach(list => {
            // Get Addres List for Parent Id = 0
            if (list.parentAddressListID === 0) {
              const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
              addressSettingEntity.addressListId = list.addressListID;
              /* this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                (result) => {
                  this.countryList = result.filter((item)=> item.name !=="ETRANGER");
                  this.country = this.countryList.find(item => item.name === this.thirdPartyforUpdate?.pays);
                  this.loadRegion(this.addressListEntity[0]?.addressListID, this.country.addressListValueID);
                }); */
            }
        })});

    }
    await this.createForm(this.thirdPartyforUpdate);


  }

  /**
  * Create Form
  * @param settingThirdParty SettingThirdPartyEntity
  */
  createForm(
    settingThirdParty: SettingThirdPartyEntity,
  ) {


    this.groupForm = this.formBuilder.group({
      firstName: [settingThirdParty?.firstName, [customRequiredValidator]],
      lastName: [settingThirdParty?.lastName, customRequiredValidator],
      phoneNumber: [settingThirdParty?.phoneNumber, [customRequiredValidator]],
      addressParty: [settingThirdParty?.addressParty],
      email: [settingThirdParty?.email, [
        customRequiredValidator,
        customEmailValidator,
        customPatternValidator(this.emailMask),
      ]
      ],
      code_postal: [settingThirdParty?.code_postal, [customRequiredValidator]],
      numero_rne: [settingThirdParty?.numero_rne, [customRequiredValidator]],
      statut: [settingThirdParty?.statut, [customRequiredValidator]],
      type: [settingThirdParty?.type, [customRequiredValidator]],
      pays: [this.country],
      ville: [this.region],
    });


  }

  loadRegion(addressListID: number, addressListValueID: number) {

    this.addressListEntity.forEach(list => {
      const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
      if (list.parentAddressListID === addressListID) {

        addressSettingEntity.addressListId = list.addressListID;
        if (addressListValueID === null) {
          addressSettingEntity.parentId = this.groupForm?.controls['pays']?.value?.addressListValueID;
        } else {
          addressSettingEntity.parentId = addressListValueID;
        }

        this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
          (result) => {
            this.regionList = result;
            this.region = this.regionList.filter(item => item.name === this.thirdPartyforUpdate?.ville)[0];
          }
        );
      }

    });
  }

  /**
  * Method exit
  */
  exit() {

    this.sharedService.resetThirdParty();
    // Edit case
    if (this.thirdPartyforUpdate !== undefined) {
      this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.THIRD_PARTY_URL)
    }// Add case
    else {
      this.groupForm.reset();
    }
  }

  ResetForm(){
    this.ngOnInit();
    this.thirdPartyforUpdate = null;
    this.elementId.thirdPartyId =  0 ;
    this.sharedService.setElementId(this.elementId) ;  
    this.groupForm.reset();
    this.udfStepWorkflowComponent.ngOnInit();
  }

  ngOnDestroy(): void {
    this.thirdPartyforUpdate = null;
    this.elementId.thirdPartyId =  0 ;
    this.sharedService.setElementId(this.elementId) ;
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  /**
     * submit form
     */
  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid || this.groupForm.invalid) {
      this.devToolsServices.InvalidControl();
      return;
    }

    if (!this.genericWorkFlowDocumentComponent.checkRequiredDocument()) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      this.devToolsServices.backTop();
      return;
    }

    if (this.udfStepWorkflowComponent.udfLoanForm.invalid || this.groupForm.invalid) {
      this.devToolsServices.InvalidControl();
      return;
    }

    if (!this.genericWorkFlowDocumentComponent.checkRequiredDocument()) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      this.devToolsServices.backTop();
      return;
    }

    if (this.groupForm.valid && this.udfStepWorkflowComponent.udfLoanForm.valid&& this.genericWorkFlowDocumentComponent.checkRequiredDocument()) {
      // Edit case
      if (this.thirdPartyforUpdate !== null) {
        this.thirdPartyforUpdate.firstName = this.groupForm.controls.firstName.value;
        this.thirdPartyforUpdate.lastName = this.groupForm.controls.lastName.value;
        this.thirdPartyforUpdate.addressParty = this.groupForm.controls.addressParty.value;
        this.thirdPartyforUpdate.email = this.groupForm.controls.email.value;
        this.thirdPartyforUpdate.phoneNumber = this.groupForm.controls.phoneNumber.value;
        this.thirdPartyforUpdate.code_postal = this.groupForm.controls.code_postal.value;
        this.thirdPartyforUpdate.numero_rne = this.groupForm.controls.numero_rne.value;
        this.thirdPartyforUpdate.statut = this.groupForm.controls.statut.value;
        this.thirdPartyforUpdate.type = this.groupForm.controls.type.value;
        /* this.thirdPartyforUpdate.pays = this.groupForm.controls.pays.value.name;
        this.thirdPartyforUpdate.ville = this.groupForm.controls.ville.value.name; */
        this.thirdPartyforUpdate.userDefinedFieldsLinksDTOs = this.udfStepWorkflowComponent.onSubmitElement();
        this.genericWorkFlowDocumentComponent.save() ;
        this.settingsService.updateSettingThirdParty(this.thirdPartyforUpdate).toPromise().then(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.sharedService.resetThirdParty();
          this.router.navigate([AcmConstants.LIST_THIRD_PARTY]);
        });
      }
      // add case
      else {
        const thirdParty: SettingThirdPartyEntity =
          new SettingThirdPartyEntity();
        thirdParty.firstName = this.groupForm.controls.firstName.value;
        thirdParty.lastName = this.groupForm.controls.lastName.value;
        thirdParty.addressParty = this.groupForm.controls.addressParty.value;
        thirdParty.email = this.groupForm.controls.email.value;
        thirdParty.phoneNumber = this.groupForm.controls.phoneNumber.value;
        thirdParty.code_postal = this.groupForm.controls.code_postal.value;
        thirdParty.numero_rne = this.groupForm.controls.numero_rne.value;
        thirdParty.statut = this.groupForm.controls.statut.value;
        thirdParty.type = this.groupForm.controls.type.value;
/*         thirdParty.pays = this.groupForm.controls.pays.value.name;
        thirdParty.ville = this.groupForm.controls.ville.value.name; */
        thirdParty.userDefinedFieldsLinksDTOs = this.udfStepWorkflowComponent.onSubmitElement();
        this.settingsService
          .createSettingThirdParty(thirdParty)
          .toPromise().then((res) => {
            this.elementId.thirdPartyId = res.id ;
            this.sharedService.setElementId(this.elementId) ;
            this.genericWorkFlowDocumentComponent.save() ;
            this.devToolsServices.openToast(0, 'alert.success');
            this.sharedService.resetThirdParty();
            this.router.navigate([AcmConstants.LIST_THIRD_PARTY]);
          });
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
    }
  }

  compareAddressListValue(addressList1, addressList2) {
    if (addressList1 !== undefined && addressList2 !== undefined) {
      return addressList1?.name === addressList2?.name;

    }
  }

  /**
    * toggle Customer Card
    */
  toggleCollapseSetting() {
    this.thirdPartySetting = !this.thirdPartySetting;
  }
  submit(){
    this.validateForm();
    this.onSubmit();
  }
  validateForm(){
    Object.values(this.groupForm.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
  });
  }

  

}

import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmMezaCardEntity } from 'src/app/shared/Entities/acmMezaCard.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { SettingFieldService } from '../../Settings/setting-fields.service';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { ActivatedRoute } from '@angular/router';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
@Component({
  selector: 'app-customer-disbursement',
  templateUrl: './customer-disbursement.component.html',
  styleUrls: ['./customer-disbursement.component.sass']
})
export class CustomerDisbursementComponent implements OnInit, OnChanges {
  public formDisbursement: FormGroup;
  @Input() expanded;
  @Input() mode; // if edit customer => mode = true
  @Input() branchId; // get branch id from parent component : customer-management.component
  public udfSettingbankInformation: UserDefinedFieldsEntity[] = [];
  public displayAccountNumber = false;
  public displayBankCode = false;
  public displayBranchCode = false;
  public disabledBranch = true;
  public selectedCustomer: CustomerEntity = new CustomerEntity();
  public udfLinkGroup: UDFLinksGroupeFieldsEntity[] = [];
  @Input() listUDFLinkBankInformation = new BehaviorSubject<UDFLinksGroupeFieldsEntity[]>([]);
  @Input() oldMezzaCard: string;
  @Input() mezaCardMasks: Map<string, RegExp>;
  @Output() updateBankInformation = new EventEmitter<boolean>();
  @Input() visibility: boolean;

  public selectedMeth: UserDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
  public isDisabled: boolean;
  public mezaCardId: number;
  public disburesementMethodSelected: string; // 'MezaCard' , '!MezaCard' , 'updatedToOtherThanMezaCard'
  public initDisburesementMethodSelected: string;
  public listBankCodeFields: UserDefinedFieldListValuesEntity[] = [];
  public filteredBankCodeListFields: UserDefinedFieldListValuesEntity[] = [];
  public bankCodeField: UserDefinedFieldListValuesEntity;
  public listBranchCodeFields: UserDefinedFieldListValuesEntity[] = [];
  public filteredBranchCodeListFields: UserDefinedFieldListValuesEntity[] = [];
  public branchCodeField: UserDefinedFieldListValuesEntity;
  public cardNumberMask = new RegExp('');
  public listDisbursementMethod: UserDefinedFieldListValuesEntity[] = [];
  public mezaStatus = false;
  public selectedLoan: LoanEntity = new LoanEntity();
  public cardNumberMaxLength;
  public placeHolderAccountNumber = '';

  source;
  constructor(public devToolsServices: AcmDevToolsServices,
    public sharedService: SharedService, public udfService: UdfService,
    public customerManagementService: CustomerManagementService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public settingFieldService: SettingFieldService,
    private dbService: NgxIndexedDBService) { }

  ngOnInit() {
    this.source = this.route.snapshot.queryParamMap.get('source');
    this.createForm();
    this.selectedCustomer = this.sharedService.getCustomer();
    if (this.selectedCustomer !== null && Object.keys(this.selectedCustomer).length !== 0) {
      if (this.selectedCustomer.mezaCardStatus === AcmConstants.MEZA_STATUS_SENT) {
        this.mezaStatus = true
      } else if (this.selectedCustomer.mezaCardStatus === AcmConstants.MEZA_STATUS_TRUST) {
        this.selectedLoan = this.sharedService.getLoan();
        if (this.selectedLoan !== null && Object.keys(this.selectedLoan).length !== 0) {
          if (this.selectedLoan.statut === AcmConstants.WORKFLOW_STATUS_REVIEW) {
            this.mezaStatus = true
          }
        }
      }
    }
    this.getudfSettingbankInformation();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedCustomer = this.sharedService.getCustomer();
    if (this.mode && changes.listUDFLinkBankInformation !== undefined && changes.listUDFLinkBankInformation.currentValue) {
      this.getudfSettingbankInformation();
    }
  }

  /**
   * get UDFLinksGroupeFieldsEntityfor selected user
   * @param listUDFLinkValue UDFLinksGroupeFieldsEntity[]
   */
  getLinkBankInformation(listUDFLinkValue) {
    // mode Edit Get Customer Disbursement information
    if (this.mode && this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      if (listUDFLinkValue.length > 0 && listUDFLinkValue[0].udfGroupeFieldsModels.length > 0) {
        listUDFLinkValue[0].udfGroupeFieldsModels.forEach(
          (bankInformation) => {
            if (bankInformation.fieldName === AcmConstants.DISBURSEMENT_METHOD) {
              let mask: RegExp;
              // default place holder and length if mask not exist
              this.placeHolderAccountNumber = '';
              this.cardNumberMaxLength = 50;
              switch (bankInformation.value) {
                case AcmConstants.BANK_ACCOUNT_ARABIC: {
                  mask = this.mezaCardMasks.get(AcmConstants.BANK_ACCOUNT);
                  if (mask) {
                    this.cardNumberMask = new RegExp(mask);
                    this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                      this.cardNumberMaxLength = element;
                    });
                    for (let i = 0; i < this.cardNumberMaxLength; i++) {
                      this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
                    }
                    this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
                  }
                  break;
                }
                case AcmConstants.MEZA_CARD_EXTERNAL_ARABIC: {
                  mask = this.mezaCardMasks.get(AcmConstants.MEZA_CARD_EXTERNAL);
                  if (mask) {
                    this.cardNumberMask = new RegExp(mask);
                    this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                      this.cardNumberMaxLength = element;
                    });
                    for (let i = 0; i < this.cardNumberMaxLength; i++) {
                      this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
                    }
                    this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
                  }
                  break;
                }
                case AcmConstants.MEZA_CARD_INTERNAL_ARABIC: {
                  mask = this.mezaCardMasks.get(AcmConstants.MEZA_CARD_INTERNAL);
                  if (mask) {
                    this.cardNumberMask = new RegExp(mask);
                    this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                      this.cardNumberMaxLength = element;
                    });
                    for (let i = 0; i < this.cardNumberMaxLength; i++) {
                      this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
                    }
                    this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
                  }
                  break;
                }
                case AcmConstants.WALLET_ARABIC: {
                  mask = this.mezaCardMasks.get(AcmConstants.WALLET);
                  if (mask) {
                    this.cardNumberMask = new RegExp(mask);
                    this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                      this.cardNumberMaxLength = element;
                    });
                    for (let i = 0; i < this.cardNumberMaxLength; i++) {
                      this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
                    }
                    this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
                  }
                  break;
                }
                case AcmConstants.NO_CARD_ARABIC: {
                  mask = this.mezaCardMasks.get(AcmConstants.NO_CARD);
                  if (mask) {
                    this.cardNumberMask = new RegExp(mask);
                    this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                      this.cardNumberMaxLength = element;
                    });
                    for (let i = 0; i < this.cardNumberMaxLength; i++) {
                      this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
                    }
                    this.formDisbursement.controls.accountNumber.setValidators([Validators.pattern(mask), Validators.required]);
                  }
                  break;
                }
              }
            } else if (bankInformation.fieldName === AcmConstants.ACCOUNT_NUMBER) {
              this.formDisbursement.controls.accountNumber.setValue(bankInformation.value);
              this.isDisabled = true;
              this.displayAccountNumber = true;
            }
          });
      }
      // List values
      this.udfSettingbankInformation.forEach(bankInformationSettingField => {
        bankInformationSettingField.fieldListValuesDTOs.forEach(bankInformationSetting => {
          if (listUDFLinkValue.length > 0) {
            listUDFLinkValue[0].udfGroupeFieldsModels.forEach(
              (bankInformation) => {
                if (bankInformationSetting.description === bankInformation.value || bankInformationSetting.idUDFListValue.toString()
                  === bankInformation.value) {
                  switch (bankInformation.fieldName) {
                    case AcmConstants.DISBURSEMENT_METHOD: {
                      if (this.formDisbursement.controls.disbursementMethod !== undefined) {
                        this.formDisbursement.controls.disbursementMethod.setValue(bankInformationSetting);
                        // this.changeDisbursementMethod();
                        if (this.selectedCustomer.acmMezaCardDTO !== null) {
                          this.mezaCardId = this.selectedCustomer.acmMezaCardDTO.idMezaCard;
                        }
                        if (bankInformation.value === AcmConstants.MEZA_CARD_ARABIC) {
                          this.initDisburesementMethodSelected = 'MezaCard';
                        } else {
                          this.initDisburesementMethodSelected = '!MezaCard';
                          this.isDisabled = false;
                        }
                      }
                      break;
                    }
                    case AcmConstants.CODE_BANK: {
                      if (this.formDisbursement.controls.bankCode !== undefined) {
                        this.formDisbursement.controls.bankCode.setValue(bankInformationSetting);
                        this.bankCodeField = bankInformationSetting;
                        this.displayBankCode = true;
                        // changing branch code list by code bank
                        const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
                        userDefinedFieldListValuesEntity.parentUDFListValue = this.formDisbursement.controls.bankCode.value.id;

                        //to do
                        if (!checkOfflineMode()) {
                          this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
                            (data) => {
                              this.udfSettingbankInformation
                                .filter(value => value.name === AcmConstants.CODE_BRANCH)[0].fieldListValuesDTOs = data;
                              this.listBranchCodeFields = data;
                              data.forEach((element) => {
                                listUDFLinkValue[0].udfGroupeFieldsModels.forEach(
                                  (bankInformationUdf) => {
                                    if ((element.description === bankInformationUdf.value || element.idUDFListValue.toString()
                                      === bankInformationUdf.value) && bankInformationUdf.fieldName === AcmConstants.CODE_BRANCH) {
                                      if (this.formDisbursement.controls.branchCode !== undefined) {
                                        this.formDisbursement.controls.branchCode.setValue(element);
                                        this.branchCodeField = element;
                                        this.displayBranchCode = true;
                                      }
                                    }
                                  });
                              });
                              this.disabledBranch = false;
                            }
                          );
                        }

                      }
                      break;
                    }
                  }
                }
              });
          }
        });
      });
    } else { // set the card number mask when mode = add customer
      if (this.udfSettingbankInformation.length > 0) {
        this.udfSettingbankInformation.forEach(
          (udfField) => {
            switch (udfField.name) {
              case AcmConstants.ACCOUNT_NUMBER: {
                this.cardNumberMask = new RegExp(udfField.fieldMasc);
                this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
                  this.cardNumberMaxLength = element;
                });
                break;
              }
            }
          });
      }
    }
  }

  createForm() {
    this.formDisbursement = this.formBuilder.group({
      accountNumber: ['', Validators.pattern(this.cardNumberMask)],
      disbursementMethod: [''],
      bankCode: [''],
      branchCode: [''],
    });
  }
  async getudfSettingbankInformation() {

    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'udf-fields-bank-info').subscribe((udf: any) => {
        if (udf === undefined) {
          this.devToolsServices.openToast(3, 'No bracnhes saved for offline use');
        } else {
          this.initializeBankInformation(udf.data);
        }
      });
    } else {
      const groupNationality: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
      groupNationality.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
      groupNationality.userDefinedFieldGroupDTO.code = AcmConstants.BANK_INFORMATION_CODE;
      await this.udfService.getUdfField(groupNationality).subscribe(
        (data) => {
          this.initializeBankInformation(data);
        });
    }

  }

  initializeBankInformation(data) {
    this.udfSettingbankInformation = data;

    if (this.udfSettingbankInformation.length > 0) {
      this.listDisbursementMethod = data.filter(value => value.name === AcmConstants.DISBURSEMENT_METHOD)[0].fieldListValuesDTOs;
     // this.listBankCodeFields = data.filter(value => value.name === AcmConstants.CODE_BANK)[0].fieldListValuesDTOs;
    }
    this.getLinkBankInformation(this.listUDFLinkBankInformation);
  }

  changeDisbursementMethod() {
    if (this.formDisbursement.controls.disbursementMethod.value.name !== AcmConstants.MEZA_CARD_INTERNAL
      && (this.selectedCustomer === null || this.selectedCustomer.mezaCardStatus === AcmConstants.MEZA_STATUS_NONE) && this.source !== 'add-customer' && !checkOfflineMode()) {
      this.customerManagementService.deleteGenerationMezaCard(this.sharedService.getUser().login).subscribe();
      if (this.mode) {
        this.selectedCustomer.acmMezaCardDTO = null;
      }
    }
    // if init === true => reset account number
    let mask: RegExp;
    // default place holder and length if mask not exist
    this.placeHolderAccountNumber = '';
    this.cardNumberMaxLength = 50;
    switch (this.formDisbursement.controls.disbursementMethod.value.name) {
      case AcmConstants.BANK_ACCOUNT: {
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.reset();
        this.formDisbursement.controls.bankCode.setValidators([Validators.required]);
        this.formDisbursement.controls.branchCode.setValidators([Validators.required]);
        this.formDisbursement.controls.accountNumber.reset();
        this.formDisbursement.controls.accountNumber.setValidators([Validators.required]);
        mask = this.mezaCardMasks.get(AcmConstants.BANK_ACCOUNT);
        if (mask) {
          this.cardNumberMask = new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
        }
        if (this.initDisburesementMethodSelected === 'MezaCard') {
          this.disburesementMethodSelected = 'updatedToOtherThanMezaCard';
        }
        // enable account number field
        this.isDisabled = false;
        this.displayBankCode = true;
        this.displayBranchCode = true;
        this.displayAccountNumber = true;
        break;
      }
      case AcmConstants.MEZA_CARD_EXTERNAL: {
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.reset();
        this.formDisbursement.controls.bankCode.setValidators([Validators.required]);
        this.formDisbursement.controls.branchCode.setValidators([Validators.required]);
        this.formDisbursement.controls.accountNumber.reset();
        this.formDisbursement.controls.accountNumber.setValidators([Validators.required]);
        mask = this.mezaCardMasks.get(AcmConstants.MEZA_CARD_EXTERNAL);
        if (mask) {
          this.cardNumberMask = new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
        }
        if (this.initDisburesementMethodSelected === 'MezaCard') {
          this.disburesementMethodSelected = 'updatedToOtherThanMezaCard';
        }
        // enable account number field
        this.isDisabled = false;
        this.displayBankCode = true;
        this.displayBranchCode = true;
        this.displayAccountNumber = true;
        break;
      }
      case AcmConstants.MEZA_CARD_INTERNAL: {
        if (this.initDisburesementMethodSelected === '!MezaCard') {
          this.disburesementMethodSelected = 'MezaCard';
        } else {
          if (this.disburesementMethodSelected !== 'MezaCard') {
            this.disburesementMethodSelected = 'MezaCard';
          }
        }
        this.formDisbursement.controls.bankCode.clearValidators();
        this.formDisbursement.controls.branchCode.clearValidators();
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.reset();
        this.formDisbursement.controls.accountNumber.setValidators([Validators.required]);
        mask = this.mezaCardMasks.get(AcmConstants.MEZA_CARD_INTERNAL);
        if (mask) {
          this.cardNumberMask = new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
        }
        // disable account number field
        this.isDisabled = true;
        this.displayBankCode = false;
        this.displayBranchCode = false;
        this.displayAccountNumber = true;
        if (!this.mode || this.selectedCustomer.acmMezaCardDTO === null || this.selectedCustomer.acmMezaCardDTO.idMezaCard === null) {
          if (this.oldMezzaCard) {
            this.formDisbursement.controls.accountNumber.setValue(this.oldMezzaCard);
            break;
          }
          this.generateMezaCardInternal();
        } else {
          this.formDisbursement.controls.accountNumber.setValue(this.selectedCustomer.acmMezaCardDTO.cardNumber);
        }
        break;
      }
      case AcmConstants.WALLET: {
        this.formDisbursement.controls.accountNumber.clearValidators();
        this.formDisbursement.controls.bankCode.clearValidators();
        this.formDisbursement.controls.branchCode.clearValidators();
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.reset();
        this.formDisbursement.controls.accountNumber.reset();
        mask = this.mezaCardMasks.get(AcmConstants.WALLET);
        if (mask) {
          this.cardNumberMask = new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
        }
        if (this.initDisburesementMethodSelected === 'MezaCard') {
          this.disburesementMethodSelected = 'updatedToOtherThanMezaCard';
        }
        this.isDisabled = false;
        this.displayBankCode = false;
        this.displayBranchCode = false;
        this.displayAccountNumber = true;
        break;
      } case AcmConstants.NO_CARD: {
        this.displayBankCode = false;
        this.displayBranchCode = false;
        this.displayAccountNumber = false;
        this.isDisabled = false;
        this.formDisbursement.controls.accountNumber.clearValidators();
        this.formDisbursement.controls.accountNumber.reset();
        this.formDisbursement.controls.bankCode.clearValidators();
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.clearValidators();
        this.formDisbursement.controls.branchCode.reset();
        mask = this.mezaCardMasks.get(AcmConstants.NO_CARD);
        if (mask) {
          this.cardNumberMask = new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.pattern(mask)]);
        }
        if (this.initDisburesementMethodSelected === 'MezaCard') {
          this.disburesementMethodSelected = 'updatedToOtherThanMezaCard';
        }
        break;
      }
      default : {
        this.displayBankCode = false;
        this.displayBranchCode = false;
        this.displayAccountNumber = false;
        this.isDisabled = false;
        this.formDisbursement.controls.accountNumber.clearValidators();
        this.formDisbursement.controls.accountNumber.reset();
        this.formDisbursement.controls.bankCode.clearValidators();
        this.formDisbursement.controls.bankCode.reset();
        this.formDisbursement.controls.branchCode.clearValidators();
        this.formDisbursement.controls.branchCode.reset();
        mask = this.mezaCardMasks.get(AcmConstants.NO_CARD);
        if (mask) {
          this.cardNumberMask =  new RegExp(mask);
          this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
            this.cardNumberMaxLength = element;
          });
          for (let i = 0; i < this.cardNumberMaxLength; i++) {
            this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
          }
          this.formDisbursement.controls.accountNumber.setValidators([Validators.pattern(mask)]);
        }
        if (this.initDisburesementMethodSelected === 'MezaCard') {
          this.disburesementMethodSelected = 'updatedToOtherThanMezaCard';
        }
        break;
      }
  }
  }
  setPlaceholderAndCardNumberMask(mask: RegExp) {
    if (mask) {
      this.cardNumberMask = new RegExp(mask);
      this.cardNumberMask.source.match(/\d+/g).map(Number).forEach(element => {
        this.cardNumberMaxLength = element;
      });
      for (let i = 0; i < this.cardNumberMaxLength; i++) {
        this.placeHolderAccountNumber = this.placeHolderAccountNumber + 'x';
      }
      this.formDisbursement.controls.accountNumber.setValidators([Validators.required, Validators.pattern(mask)]);
    }
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  compareBranchCode(branchCode1, branchCode2) {
    if (branchCode1 !== null && branchCode2 !== null && branchCode1 !== undefined && branchCode2 !== undefined) {
      return branchCode1.idUDFListValue === branchCode2.idUDFListValue;
    }
  }

  compareBankCode(bankCode1, bankCode2) {
    if (bankCode1 !== null && bankCode2 !== null && bankCode1 !== undefined && bankCode2 !== undefined) {
      return bankCode1.idUDFListValue === bankCode2.idUDFListValue;
    }
  }

  compareDisbursementMethode(method1, method2) {
    if (method1 !== null && method2 !== null && method1 !== undefined && method2 !== undefined) {
      return method1.idUDFListValue === method2.idUDFListValue;
    }
  }

  changeFormBankInformation() {
    this.updateBankInformation.emit(false);
  }

  /**
   * changeBranchCode
   */
  changeBranchCode() {
    if (this.formDisbursement.controls.bankCode.value !== null) {
      this.branchCodeField = null;
      this.formDisbursement.controls.branchCode.setValue('');
      const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
      userDefinedFieldListValuesEntity.parentUDFListValue = this.formDisbursement.controls.bankCode.value.id;
      this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
        (data) => {
          this.listBranchCodeFields = data;
          this.disabledBranch = false;
          this.udfSettingbankInformation.filter(value => value.name === AcmConstants.CODE_BRANCH)[0].fieldListValuesDTOs = data;
        }
      );
    } else {
      this.disabledBranch = true;
    }
  }

  /**
   * suggestions list of code bank
   * @param event query
   */
  filterBankCodeFields(event) {
    this.filteredBankCodeListFields = [];
    for (let i = 0; i < this.listBankCodeFields.length; i++) {
      const bankCode = this.listBankCodeFields[i].description;
      if (bankCode.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredBankCodeListFields.push(this.listBankCodeFields[i]);
      }
    }
  }
  /**
   * suggestions list of branch code
   * @param event query
   */
  filterBranchCodeFields(event) {
    this.filteredBranchCodeListFields = [];
    for (let i = 0; i < this.listBranchCodeFields.length; i++) {
      const branchCode = this.listBranchCodeFields[i].description;
      if (branchCode.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredBranchCodeListFields.push(this.listBranchCodeFields[i]);
      }
    }
  }

  /**
   * generateMezaCardInternal
   */
  generateMezaCardInternal() {
    if (this.branchId !== null && this.branchId !== undefined) {
      const mezaCard = new AcmMezaCardEntity();
      mezaCard.branchID = this.branchId;
      mezaCard.status = AcmConstants.ACTIVATE;
      // get first meza card number by branch id and status order by cardNumber
      this.customerManagementService.getMezaCard(mezaCard).subscribe((data) => {
        if (data !== null) {
          this.mezaCardId = data.idMezaCard;
          this.formDisbursement.controls.accountNumber.setValue(data.cardNumber);
          if (this.mode) {
            this.selectedCustomer.acmMezaCardDTO = data;
          }
        } else {
          this.formDisbursement.controls.accountNumber.setValue('');
        }
      });
    } else {
      this.formDisbursement.controls.accountNumber.setValue('');
      this.devToolsServices.openToast(3, 'alert.no_branch_selected');
    }
  }

  /**
   * enable Refresh Meza Card
   */
  enableRefresh() {
    // Add Customer : enable only if : disbursementmethod = meza card internal
    // EditCustomer and CLD :  enable only if : disbursementmethod = meza card internal and selectedCustomer.mezaCardStatus !== 'NONE'
    return (this.formDisbursement.controls.disbursementMethod.value.name === AcmConstants.MEZA_CARD_INTERNAL
      && this.selectedCustomer === null) ||
      (this.formDisbursement.controls.disbursementMethod.value.name === AcmConstants.MEZA_CARD_INTERNAL &&
        this.selectedCustomer !== null && this.selectedCustomer.mezaCardStatus === AcmConstants.MEZA_STATUS_NONE);
  }
  setSelectedCustomerMezaCardStatus(newMezaCardStatus: string) {
    this.selectedCustomer.mezaCardStatus = newMezaCardStatus;
  }
  resetDisburesementMethodSelected() {
    if (this.formDisbursement.controls.disbursementMethod.value.name === AcmConstants.MEZA_CARD_INTERNAL) {
      this.disburesementMethodSelected = 'MezaCard';
    } else {
      this.disburesementMethodSelected = '!MezaCard';
    }
  }
}

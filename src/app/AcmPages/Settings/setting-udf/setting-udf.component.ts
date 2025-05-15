import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from "ngx-loading";
import { AppComponent } from "src/app/app.component";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { ConfirmationDialogComponent } from "src/app/shared/confirmation-dialog/confirmation-dialog.component";
import { SettingsService } from "../settings.service";
import { SelectItem } from "primeng/api";
import { UdfService } from "../../Loan-Application/udf/udf.service";
import { UserDefinedFieldGroupEntity } from "src/app/shared/Entities/userDefinedFieldGroup.entity";
import { ProductEntity } from "src/app/shared/Entities/product.entity";
import { LoanManagementService } from "../../Loan-Application/loan-management/loan-management.service";
import { UserDefinedFieldsEntity } from "src/app/shared/Entities/userDefinedFields.entity";
import { UserDefinedFieldListValuesEntity } from "src/app/shared/Entities/userDefinedFieldListValues.entity";
import { catchError, switchMap, tap } from "rxjs/operators";
import { forkJoin, of } from "rxjs";
import {
  findObjectsByConcatenatedValue,
  generateUniqueID,
  concatenateValues,
} from "src/app/shared/utils";

const PrimaryBleu = "var(--primary)";

@Component({
  selector: "app-setting-udf",
  templateUrl: "./setting-udf.component.html",
  styleUrls: ["./setting-udf.component.sass"],
})
export class SettingUdfComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  @ViewChild("addListModal", { static: true }) addListModal: TemplateRef<any>;
  listForm: FormGroup;
  loading: boolean;
  updateId = 0;
  listUDF: any[] = [];
  listUDFField: UserDefinedFieldsEntity[] | any[] = [];
  selectedColumns: any[] = ["code", "description", "enabled"];
  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  primaryColour = PrimaryBleu;
  config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };

  udfGroupForm: FormGroup;
  udfTypeOptions: SelectItem[];
  productOptions: SelectItem[];
  customerTypeOptions: SelectItem[];
  fieldType: any[];
  products: ProductEntity[] = [];
  udfGroups: UserDefinedFieldGroupEntity[] = [];
  listValues: UserDefinedFieldListValuesEntity[] = [];
  udfGroup: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  translatedDefaultLabel: any;
  index: number;
  fieldListValues: UserDefinedFieldListValuesEntity[][] = [];
  selectedCategories: SelectItem[] = [];
  selectedProducts: SelectItem[] = [];
  selectedCustomerType: any;
  modalReference = null;
  addedListValues: any[][] = [];

  udfParentList: any[];
  udfParentListValues: any[];
  displayMultiSelect: boolean = false;
  displayMultiSelectCustomer:boolean=false;

  listUDFFieldToDisable: UserDefinedFieldsEntity[] = [];
  listValuesToDisable: UserDefinedFieldListValuesEntity[] = [];

  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(
    private ngbconfig: NgbModalConfig,
    public modal: NgbModal,
    public router: Router,
    public dialog: MatDialog,
    public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService,
    public library: FaIconLibrary,
    private fb: FormBuilder,
    private udfService: UdfService,
    public loanManagementService: LoanManagementService
  ) {
    ngbconfig.backdrop = "static";
    ngbconfig.keyboard = false;
  }

  ngOnInit() {
    this.udfTypeOptions = [
      { label: "Customer", value: "customer" },
      { label: "Loan Products", value: "loanProducts" },
      { label: "Loan Collateral", value: "loanCollateral" },
      { label: "Collection", value: "collection" },
      { label: "Legal", value: "legal" },
      { label: "Party", value: "party" },
      { label: "Prospect", value: "prospect" },
      { label: "Supplier", value: "supplier" },
      { label: "Others", value: "others" },
    ];

    this.customerTypeOptions = [
      { label: "Personal", value: 1 },
      { label: "Organization", value: 4 },
      { label: "Group", value: 8 },
    ];

    this.fieldType = [
      { label: "TEXT", value: 1 },
      { label: "NUMERIC", value: 2 },
      { label: "DATE", value: 4 },
      { label: "LIST", value: 5 },
    ];

    this.createForm();

    // init get udf groups list
    this.getUdfGroup();

    // get the list of products
    this.getProducts();


  }
  /**
   * Methode to create form
   */
  createForm() {
    this.udfGroupForm = this.fb.group({
      id: [""],
      idUDGroupAbacus: [0],
      code: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      productId: [""],
      customerType: [""],
      mondatory: [false, Validators.required],
      enabled: [true],
    });

    this.listForm = this.formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      description: ["", Validators.required],
      parent: [""],
    });
  }

  /**
   * load products
   */
  async getProducts() {
    let data;
    const productEntity = new ProductEntity();

    data = await this.loanManagementService
      .getProducts(productEntity)
      .toPromise();
    this.products = data;
  }

  /**
   * Methode addGroup
   */
  addGroup(): void {
    this.listValues = [];
    this.updateId = 0;
    this.reset();
    this.modal.open(this.modalContent, { size: "xl" });
  }

  /**
   * The function "reset" resets various properties and forms in the current context.
   */
  reset() {
    this.udfGroupForm.reset();
    this.listForm.reset();
    this.listUDFField = [];
    this.selectedCategories = [];
    this.selectedProducts = [];
    this.selectedCustomerType = null;
    this.listValues = [];
    this.udfParentListValues = [];
    this.udfParentList = [];
    this.fieldListValues = [];
    this.listUDFFieldToDisable = [];
    this.listValuesToDisable = [];
  }


  updateMultiSelectVisibility() {
    this.displayMultiSelect = this.selectedCategories?.some(
      item => item.value === 'loanProducts' || item.value === 'loanCollateral'
    );
    this.displayMultiSelectCustomer = this.selectedCategories?.some(
      item => item.value === 'loanProducts' || item.value === 'loanCollateral' || item.value === 'customer'
    );
  }



  /**
   * The function "reset" resets various properties and forms in the current context.
   */
  resetUDFListValue() {
    // Reset listValues
    this.listValues.map((item) => {
      const parentUDFListValue: any = item.parentUDFListValue;
      item.parentUDFListValue = parentUDFListValue?.value;
    });
  }

  /**
   * Methode editEvent
   * @param groupeEntity GroupeEntity
   */
  editGroup(groupeEntity: UserDefinedFieldGroupEntity) {
    this.getUdfFiledListNationality(groupeEntity.id);
    this.selectedCategories = findObjectsByConcatenatedValue(
      this.udfTypeOptions,
      "value",
      groupeEntity.category
    );

    this.selectedProducts = findObjectsByConcatenatedValue(
      this.products,
      "id",
      String(groupeEntity.productId),
      "number"
    );
    let customerType = findObjectsByConcatenatedValue(
      this.customerTypeOptions,
      "value",
      String(groupeEntity.customerType),
      "number"
    );
    this.selectedCustomerType = customerType[0];

    this.udfGroupForm.patchValue({
      id: groupeEntity.id,
      code: groupeEntity.code,
      description: groupeEntity.description,
      mondatory: groupeEntity.mondatory,
    });
    this.updateMultiSelectVisibility()
    this.modal.open(this.modalContent, { size: "xl" });

    this.updateId = 1;

  }

  /**
   * The function `getUdfFiledListNationality` retrieves a list of user-defined fields based on a given
   * ID and updates the data with additional information before assigning it to `listUDFField`.
   * @param {number} id - The `id` parameter is a number that represents the ID of a user-defined field
   * group.
   */
  async getUdfFiledListNationality(id: number) {
    const userDefinedFieldsEntity: UserDefinedFieldsEntity =
      new UserDefinedFieldsEntity();
    userDefinedFieldsEntity.userDefinedFieldGroupDTO =
      new UserDefinedFieldGroupEntity();
    userDefinedFieldsEntity.userDefinedFieldGroupDTO.id = id;
    userDefinedFieldsEntity.idUDFField = 0;
    this.udfService.getUdfField(userDefinedFieldsEntity).subscribe((data) => {
      const updatedData = data.map((item) => ({
        ...item,
        fieldTypeLabel: findObjectsByConcatenatedValue(
          this.fieldType,
          "value",
          String(item.fieldType),
          "number"
        )?.[0],
      }));

      this.listUDFField = updatedData;
    });
  }

  /**
   * Methode addList
   */
  addList(udfField: UserDefinedFieldsEntity, index: number) {

    if (this.updateId === 0) {
      this.listValues = [];
      this.listForm.patchValue({
        name: udfField.name,
        description: udfField.description,
      });
    }

    this.getUDFFieldsListType(udfField.id);

    if (this.updateId !== 0) {
      if (udfField.fieldListValuesDTOs.length > 0)
        this.getUdfListValue(udfField.fieldListValuesDTOs[0]?.idUDFListLink);

      if (udfField?.fieldListValuesDTOs.length > 0) {
        this.listValues = udfField?.fieldListValuesDTOs;
        if(this.listValues[0]?.parentUDFListValue){
          this.getListValueById(this.listValues[0]?.parentUDFListValue);}
      } else {
        if (this.addedListValues[index]) {
          this.listValues = this.addedListValues[index];
        } else {
          this.listForm.reset();
          this.listValues = [];
        }
      }
    }
    this.index = index;
    this.modalReference = this.modal.open(this.addListModal, { size: "lg" });
  }

  /**
   * Get UDF fields whose field type is List
   */
  getUDFFieldsListType(idUDFCurrentList: number) {
    const userDefinedFieldsEntity: UserDefinedFieldsEntity =
      new UserDefinedFieldsEntity();
    userDefinedFieldsEntity.fieldType = 5; // The field type is LIST
    userDefinedFieldsEntity.idUDFField = 0; // The field is an ACM field
    this.udfService.getUdfField(userDefinedFieldsEntity).subscribe((data) => {
      this.udfParentList = data
        .filter((item: UserDefinedFieldsEntity) => item.id !== idUDFCurrentList)
        .map((item: UserDefinedFieldsEntity) => ({
          label: item.name,
          value: item.id,
        }));
    });
  }

  getUdfListValue(userDefinedFieldListValuesId: number) {
    const userDefinedFieldListValuesEntity: UserDefinedFieldListValuesEntity =
      new UserDefinedFieldListValuesEntity();
    userDefinedFieldListValuesEntity.idUDFList = userDefinedFieldListValuesId; // The field type is LIST
    this.udfService
      .getUdfListValue(userDefinedFieldListValuesEntity)
      .subscribe((data) => {
        if (data) {
          this.listForm.patchValue({
            id: data[0].id,
            name: data[0].name,
            description: data[0].description,
          });
        }
      });
  }

  /**
   * Set parent list values based on the selected list
   */
  setParentListValues(event: any) {
    const userDefinedFieldsEntity: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
    userDefinedFieldsEntity.id = event?.value;
    userDefinedFieldsEntity.idUDFField = 0; // The field is an ACM field
    this.udfService.getUdfField(userDefinedFieldsEntity).subscribe((data) => {
      this.udfParentListValues = data[0]?.fieldListValuesDTOs.map(
        (item: any) => ({
          label: item.name,
          value: item.id,
        })
      );
    });
  }

  /**
   * To define the initial values of udf parent list, we have defined the following two functions
   * Step 1 : getListValueById
   * Step 2 : getListByIdUDFListValue
   */

  /**
   * Get List Value By Id
   */
  getListValueById(id: number) {
    const userDefinedFieldListValuesEntity: UserDefinedFieldListValuesEntity =
      new UserDefinedFieldListValuesEntity();
    userDefinedFieldListValuesEntity.id = id;

    this.udfService
      .getUdfListValue(userDefinedFieldListValuesEntity)
      .subscribe((data) => {
        this.getListByIdUDFListValue(data[0]?.idUDFListLink);
      });
  }

  /**
   * Get List By idUDFListValue, then set initial values of udf parent list and udf parent list value
   */
  getListByIdUDFListValue(idUDFListLink: number) {
    const userDefinedFieldsEntity: UserDefinedFieldsEntity =
      new UserDefinedFieldsEntity();
    userDefinedFieldsEntity.idUDFListValue = idUDFListLink;
    userDefinedFieldsEntity.idUDFField = 0;
    this.udfService.getUdfField(userDefinedFieldsEntity).subscribe((data) => {

      //  Set initial value of udf parent list
      this.listForm.patchValue({
        parent: { label: data[0]?.name, value: data[0]?.id },
      });

      // Set udf Parent List Values based on the default udf parent list
      this.udfParentListValues = data[0]?.fieldListValuesDTOs.map(
        (item: any) => ({
          label: item.name,
          value: item.id,
        })
      );

      // Set initial value of udf parent list value
      this.listValues.map((item) => {
        let res = data[0]?.fieldListValuesDTOs.filter(
          (item2) => item2.id == item.parentUDFListValue
        );
        const parentUDFListValue: any = {
          label: res[0]?.name,
          value: res[0]?.id,
        };
        item.parentUDFListValue = parentUDFListValue;
      });
    });
  }

  /**
   * The function `getUdfGroup` retrieves a user-defined field group from a service and assigns the
   * result to a variable.
   * @param {UserDefinedFieldGroupEntity} udfGroup - The parameter `udfGroup` is of type
   * `UserDefinedFieldGroupEntity`.
   */
  getUdfGroup() {
    this.udfGroup = new UserDefinedFieldGroupEntity();
    this.udfGroup.idUDGroupAbacus = 0;

    this.udfService.getUdfGroup(this.udfGroup).subscribe((data) => {
      this.udfGroups = data;
    });
  }

  /**
   * The `saveUdfGroup` function saves user-defined field groups and fields for each customer type
   * selected.
   */
  saveUdfGroup() {
    this.udfGroupForm.get('productId').updateValueAndValidity();
    this.udfGroupForm.get('customerType').updateValueAndValidity();

    this.udfGroupForm.patchValue({
      enabled: true,
      idUDGroupAbacus: 0,
    });

    if (!this.validateUdfGroupData()) {
      this.devToolsServices.openToast(3, "alert.check-data");
      this.devToolsServices.backTop();
      return;
    }

    const catogories = concatenateValues(
      this.udfGroupForm.value?.category,
      "value"
    );
    let productIds : String;

    if(this.udfGroupForm.value.productId){
      productIds = concatenateValues(
        this.udfGroupForm.value.productId,
        "id"
      );
    }

    // Clone the initial udfGroupForm
    let baseUdfGroupForm = { ...this.udfGroupForm.value };
    baseUdfGroupForm.category = catogories;
    baseUdfGroupForm.productId = productIds;
    baseUdfGroupForm.customerType = this.udfGroupForm.value.customerType?.value;

    this.listUDFField.forEach((field) => {
      const fieldTypeLabel: any = field.fieldTypeLabel;
      field.fieldTypeLabel = fieldTypeLabel.label;
      field.fieldType = fieldTypeLabel.value;
    });

    const udfGroupForm = { ...baseUdfGroupForm };

    // Save User-Defined Field Group and get the groupData
    this.udfService
      .saveUdfGroup(udfGroupForm)
      .pipe(
        switchMap((groupData) => {
          const groupId = groupData.id;

          // Save User-Defined Fields
          return forkJoin(
            this.listUDFField.map((field: UserDefinedFieldsEntity, index: number) => {

              field.userDefinedFieldGroupDTO.id = groupId;

              if (field.fieldType === 5 && field.idUDFListValue === 0)
                field.idUDFListValue = generateUniqueID(index);

              if (field.fieldType === 5) {
                if (this.fieldListValues && this.fieldListValues.length > 0) {
                  if (this.fieldListValues[index]) {
                    this.fieldListValues[index].map((item,indexItem: number) => {
                      if (item.tableAbacusName === "UserDefinedFieldLists") {
                        item.idUDFList = field.idUDFListValue;
                        field.idUDFParentField = item.parentUDFListValue;
                        item.parentUDFListValue = 0;
                      } else {
                        item.idUDFListValue = generateUniqueID(indexItem);
                        item.idUDFListLink = field.idUDFListValue;
                      }
                    });
                  }
                }
              }

              // Save User-Defined Field and log its ID
              return this.udfService.saveUdfField(field).pipe(
                switchMap(() => {
                  // Conditionally call savUdfListValue if fieldType is 5
                  if (field.fieldType === 5) {
                    if (this.fieldListValues && this.fieldListValues.length > 0 && this.fieldListValues[index]) {
                      return this.udfService.savUdfListValue(this.fieldListValues[index]);
                    }
                    else {
                      // Return an observable with no value (empty observable)
                      return of(null);
                    }
                  }
                  else {
                    // Return an observable with no value (empty observable) if fieldType is not 5
                    return of(null);
                  }
                })
              );
            }
            )
          ).pipe(
            tap(() => {
              this.devToolsServices.openToast(0, "alert.success");
              this.getUdfGroup();
              this.modal.dismissAll();
              this.reset();
            }),
            catchError((error) => {
              // Handle error if any of the field saving promises fails
              this.devToolsServices.openToast(1, "alert.error");
              throw error; // Re-throw the error to be caught by the outer catchError
            })
          );
        }),
        catchError((error) => {
          // Handle error if saving UDF group fails
          this.devToolsServices.openToast(1, "alert.error");
          throw error; // Re-throw the error to be caught by the outer catchError
        })
      )
      .subscribe(
        () => {
          this.updateId = 0;
        },
        (error) => {
          // Handle error if saving UDF group fails
          this.devToolsServices.openToast(1, "alert.error");
          throw error; // Re-throw the error to be caught by the outer catchError
        }
      );


    // Disable udf fields
    if(this.listUDFFieldToDisable.length > 0) {
      this.listUDFFieldToDisable.forEach((field) => {
        const fieldTypeLabel: any = field.fieldTypeLabel;
        field.fieldTypeLabel = fieldTypeLabel.label;
        field.fieldType = fieldTypeLabel.value;
      });

      this.udfService.disableUdfFields(this.listUDFFieldToDisable).subscribe((res)=>{
        this.modal.dismissAll();
        this.reset();
      })
    }

    // Disable udf list values
    if(this.listValuesToDisable.length > 0){
      this.udfService.disableUdfListValues(this.listValuesToDisable).subscribe((res)=>{
        this.modal.dismissAll();
        this.reset();
      })
    }
  }

  /**
   * The function deletes a row from a list of values at the specified index.
   * @param rowIndex - The rowIndex parameter is the index of the row that you want to delete from the
   * listValues array.
   */
  deleteFromListValues(rowIndex) {
    this.listValuesToDisable.push(this.listValues[rowIndex]);
    this.listValues.splice(rowIndex, 1); // Remove the row at the specified index
  }

  /**
   * The function "addToListValues" adds a new UserDefinedFieldListValuesEntity object to the listValues
   * array.
   */
  addToListValues() {

    let listValuesField = new UserDefinedFieldListValuesEntity();

    listValuesField.tableAbacusName = "UserDefinedFieldListValues";
    listValuesField.score = 0;
    listValuesField.name = "";
    listValuesField.description = "";
    listValuesField.enabled = true;
    listValuesField.parentUDFListValue = 0;

    this.listValues.push(listValuesField);
  }

  /**
   * The function `deleteFromListUDF` removes a row from the `listUDFField` array at the specified index.
   * @param rowIndex - The rowIndex parameter is the index of the row that you want to delete from the
   * listUDFField array.
   */
  deleteFromListUDF(rowIndex) {
    this.listUDFFieldToDisable.push(this.listUDFField[rowIndex]);
    this.listUDFField.splice(rowIndex, 1); // Remove the row at the specified index
  }

  /**
   * The function saves a list of values and a user-defined field list to an array.
   */
  saveListValuesField() {
    if (!this.validateListValuesData()) {
      this.devToolsServices.openToast(3, "alert.check-data");
      this.devToolsServices.backTop();
      return;
    }

    this.fieldListValues[this.index] = [];
    this.addedListValues[this.index] = [];

    const userDefinedFieldLists = new UserDefinedFieldListValuesEntity();

    userDefinedFieldLists.tableAbacusName = "UserDefinedFieldLists";
    userDefinedFieldLists.score = 0;
    userDefinedFieldLists.id = this.listForm.value.id;
    userDefinedFieldLists.name = this.listForm.value.name;
    userDefinedFieldLists.description = this.listForm.value.description;
    userDefinedFieldLists.enabled = true;
    if(this.listForm.value?.parent?.value){
      userDefinedFieldLists.parentUDFListValue = this.listForm.value?.parent?.value;
    }
    else{
      userDefinedFieldLists.parentUDFListValue = 0;
    }
    this.listValues.forEach((item) => {
      if (item.parentUDFListValue == null) {
        item.parentUDFListValue = 0;
      } else {
        const parentUDFListValue: any = item.parentUDFListValue;
        item.parentUDFListValue = parentUDFListValue.value;
      }
    });

    this.addedListValues[this.index].push(...this.listValues);
    this.fieldListValues[this.index].push(...this.listValues);
    this.fieldListValues[this.index].push(userDefinedFieldLists);

    this.modalReference.close();
  }

  /**
   * The function "addToListUDFt" adds a new empty row to the "listUDF" array.
   */
  addToListUDF() {
    const newUDFField: UserDefinedFieldsEntity = new UserDefinedFieldsEntity(); // Create a new empty row
    newUDFField.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity(); // Initialize related objects as needed
    newUDFField.idUDFField = 0;
    newUDFField.name = "";
    newUDFField.description = "";
    newUDFField.mandatory = false;
    newUDFField.fieldType = 0;
    newUDFField.fieldTypeLabel = "";
    newUDFField.idUDFListValue = 0;
    newUDFField.idUDFParentField = 0;
    newUDFField.udfParentFieldValue = "0";
    newUDFField.enabled = true;
    newUDFField.fieldListValuesDTOs = [];
    newUDFField.fieldValue = "";
    newUDFField.fieldMasc = "";
    newUDFField.uniqueField = false;

    this.listUDFField.push(newUDFField); // Add the new row to the list array
  }

  async openDialog(groupeEntityToDisable: UserDefinedFieldGroupEntity) {
    if (!groupeEntityToDisable.enabled) {
      groupeEntityToDisable.enabled = false;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: "350px",
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          message: "confirmation_dialog.disable_group",
        },
      });
      await dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.udfService
            .saveUdfGroup(groupeEntityToDisable)
            .toPromise()
            .then((resultEntity) => {
              this.devToolsServices.openToast(0, "alert.success");

              this.getUdfGroup();
            });
        }
      });
    } else {
      groupeEntityToDisable.enabled = true;
      await this.udfService
        .saveUdfGroup(groupeEntityToDisable)
        .toPromise()
        .then((resultEntity) => {
          this.devToolsServices.openToast(0, "alert.success");
        });
    }
    this.getUdfGroup();
  }

  validateUdfGroupData(): boolean {
    // Check if any required fields are empty
    this.devToolsServices.makeFormAsTouched(this.udfGroupForm);
    if (!this.udfGroupForm.valid) {
      return false;
    }

    // Check for empty objects in listUDFField array
    const emptyFieldsExist = this.listUDFField.some(
      (field) => !field.ordre || !field.name || !field.description || !field.fieldTypeLabel
    );
    if (emptyFieldsExist) {
      // Display an error message or perform other actions
      return false;
    }

    return true;
  }

  validateListValuesData(): boolean {
    // Check if any required fields are empty
    this.devToolsServices.makeFormAsTouched(this.listForm);

    if (!this.listForm.valid) {
      // Display an error message or perform other actions
      return false;
    }

    // Check for empty objects in listValues array
    const emptyValuesExist = this.listValues.some(
      (value) => !value.name || !value.description
    );
    if (emptyValuesExist) {
      // Display an error message or perform other actions
      return false;
    }

    return true;
  }

  getDirection() {
    return AppComponent.direction;
  }
}

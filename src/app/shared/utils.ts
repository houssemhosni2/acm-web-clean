import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { CustomerEntity } from "./Entities/customer.entity";
import { CollectionEntity } from "./Entities/acmCollection.entity";
import { UserDefinedFieldsLinksEntity } from "./Entities/userDefinedFieldsLinks.entity";
import { UserDefinedFieldGroupEntity } from "./Entities/userDefinedFieldGroup.entity";
import { UDFLinksGroupeFieldsEntity } from "./Entities/udfLinksGroupeFields.entity";
import { UDFLinksGroupeFieldsModelEntity } from "./Entities/udfLinksGroupeFieldsModel.entity";
import { AcmConstants } from "./acm-constants";

export function checkOfflineMode(): boolean {
  const offline = sessionStorage.getItem('offline') === 'true' || sessionStorage.getItem('isFromOfflineSync') === 'true';
  return offline === true;
}

export function generateRandomNumber() {
  const length = 15;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function addQueryParams(url: string, params: { [key: string]: string }): string {
  const urlObj = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  return urlObj.href;
}

/**
 * The function getCurrentUnixTimestamp returns the current Unix timestamp in seconds.
 * @returns the current Unix timestamp as a number.
 */
export function getCurrentUnixTimestamp(): number {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().charAt(3);
  const month = currentDate.getMonth().toString().charAt(0); // Months are zero-based, so January is 0
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const milliseconds = currentDate.getMilliseconds();
  return Number( (year+''+month+''+day+''+hours+''+minutes+''+seconds+''+milliseconds).replace(/ /g, ''))
}

/**
 * The function generates a unique ID by combining the current Unix timestamp with a random number.
 * @returns a unique ID as a number.
 */
export function generateUniqueID(index : number): number {
  const unixTimestamp = getCurrentUnixTimestamp();
  // const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
  const uniqueIDString = `${unixTimestamp}${index}`;
  const uniqueID = parseInt(uniqueIDString, 10);
  return uniqueID % 1e15;
}


/**
 * The function `findObjectsByConcatenatedValue` takes an array of objects, a key, a concatenated
 * value, and an optional type, and returns an array of objects that have a matching value for the
 * specified key.
 * @param objectsArray - An array of objects that you want to search through.
 * @param key - The key parameter is the property key of the objects in the objectsArray that you want
 * to search for.
 * @param value - The `value` parameter is a string that contains concatenated values separated by
 * commas.
 * @param [type=string] - The `type` parameter is an optional parameter that specifies the type of
 * values in the `value` parameter. It can be either `'string'` or `'number'`. If not provided, it
 * defaults to `'string'`.
 * @returns an array of objects that have a key-value pair matching the given concatenated value.
 */
export function findObjectsByConcatenatedValue(objectsArray, key, value, type = 'string') {
  if (!value) {
    return []; // Return an empty array if the value is empty
  }

  let concatenatedValues = value.split(',');

  if (type === 'number') {
    concatenatedValues = concatenatedValues.map(Number); // Convert values to numbers
  }

  const matchingObjects = [];

  for (const obj of objectsArray) {
    if (concatenatedValues.includes(type === 'number' ? Number(obj[key]) : obj[key])) {
      matchingObjects.push(obj);
    }
  }

  return matchingObjects;
}


/**
 * The function takes an array of objects and a key, and returns a string by concatenating the values
 * of the specified key from each object, separated by commas.
 * @param {any[]} dataList - The `dataList` parameter is an array of objects. Each object in the array
 * represents a data item and contains multiple key-value pairs.
 * @param {string} key - The `key` parameter is a string that represents the property name of the
 * objects in the `dataList` array that you want to concatenate.
 * @returns a concatenated string of values from the dataList array, based on the specified key.
 */
export function concatenateValues(dataList: any[], key: string): string {
  const concatenatedString: string = dataList.map((item: string) => item[key]).join(',');
  return concatenatedString;
}

/** this function is a custom required validator */
export function customRequiredValidator(control: FormControl): ValidationErrors | null {
  if (control.value === '' || control.value === null || control.value === undefined) {
    return { customError: 'This field is required.' };
  }
  return null;
}

/** this function is a custom email validator */
export function customEmailValidator(emailMask: RegExp): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const emailValue = control.value;
    if (!emailValue) {
      return null;
    }
    
    const emailCustomValid = emailMask.test(control.value);
    if ( !emailCustomValid) {
      return { emailInvalid: 'Invalid email format.' };
    }
    return null;
  };
}
export function customPatternValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString(); 
    if (value && !pattern.test(value)) {
      return { customPatternError: 'Invalid pattern.' };
    }
    return null;
  };
}

export function isTodayBetweenDates(startPromo: Date, endPromo: Date): boolean {
  const today = new Date();
  const start = new Date(startPromo);
  const end = new Date(endPromo);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return today.getTime() >= start.getTime() && today.getTime() <= end.getTime();
}


export function isTodayGt(startPromo: Date): boolean {
  const today = new Date();
  const start = new Date(startPromo);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  return today.getTime() >= start.getTime() ;
}

export function getCustomerFields(): string[] {
  let customerKeys : CustomerEntity = new CustomerEntity();
  customerKeys.id = 0;
  customerKeys.customerIdExtern = 0;
  customerKeys.customerNumber = '';
  customerKeys.customerName = '';
  customerKeys.customerNameNoPipe = '';
  customerKeys.firstName = '';
  customerKeys.secondName = '';
  customerKeys.middleName = '';
  customerKeys.lastName = '';
  customerKeys.customerOpenDate = '';
  customerKeys.dateOfBirth = new Date();
  customerKeys.dateOfBirthHijri = '';
  customerKeys.accountPortfolioID = '';
  customerKeys.accountPortfolioCode = '';
  customerKeys.accountPortfolioDescription = '';
  customerKeys.altName = '';
  customerKeys.customerAddress = '';
  customerKeys.branchId = 0;
  customerKeys.branchesName = '';
  customerKeys.branchesDescription = '';
  customerKeys.age = 0;
  customerKeys.arrearDay = 0;
  customerKeys.arrearSchedule = 0;
  customerKeys.telephone1 = '';
  customerKeys.telephone2 = '';
  customerKeys.telephone3 = '';
  customerKeys.customerType = '';
  customerKeys.customerCategory = '';
  customerKeys.organisationId = 0;
  customerKeys.groupeId = 0;
  customerKeys.telephone = '';
  customerKeys.fax = '';
  customerKeys.registerNumber = '';
  customerKeys.webSite = '';
  customerKeys.sector = '';
  customerKeys.organisationIdExtern = '';
  customerKeys.email = '';
  customerKeys.gender = '';
  customerKeys.organizationName = '';
  customerKeys.accountYearEnd = new Date();
  customerKeys.customerLinksRelationshipDTOs = [];
  customerKeys.customerLinksDTOs = [];
  customerKeys.solidarityName = '';
  customerKeys.listAddress = [];
  customerKeys.updateCustomer = false;
  customerKeys.isCustomer = false;
  customerKeys.userDefinedFieldsLinksDTOs = [];
  customerKeys.amountGuarantor = 0;
  customerKeys.listUDF = [];
  customerKeys.guarantors = [];
  customerKeys.listUDFGroup = [];
  customerKeys.expiryHijryDate = null;
  customerKeys.identity = '';
  customerKeys.industryCode = null;
  customerKeys.resident = false;
  customerKeys.colorCustomerKYC = '';
  customerKeys.currentCustomerKYC = 0;
  customerKeys.existkyc = false;
  customerKeys.thirdPartyHistoriqueKyc = null;
  customerKeys.currentCustomerAML = 0;
  customerKeys.colorCustomerAml = '';
  customerKeys.existaml = false;
  customerKeys.thirdPartyHistoriqueAml = null;
  customerKeys.currentCustomerISCORE = 0;
  customerKeys.colorCustomerISCORE = '';
  customerKeys.existISCORE = false;
  customerKeys.thirdPartyHistoriqueISCORE = null;
  customerKeys.customerLinkCategory = '';
  customerKeys.maritalStatus = '';
  customerKeys.imageGrpOrg = null;
  customerKeys.photo = null;
  customerKeys.mezaCardId = 0;
  customerKeys.disbursementMethodUpdatedToOtherThanMezaCard = false;
  customerKeys.mezaCardStatus = '';
  customerKeys.acmMezaCardDTO = null;
  customerKeys.disbursementMethodSelected = '';
  customerKeys.dateInsertion = new Date();
  customerKeys.action = '';
  customerKeys.enableCriticalData = false;
  customerKeys.enabled = false;
  customerKeys.ibCustomerId = 0;
  customerKeys.udfLinksGroupeFieldsDTOs = [];
  customerKeys.isSupplier = false;
  customerKeys.beneficialEffective = '';
  customerKeys.prospectionSource = '';
  customerKeys.prospectionComment = '';
  customerKeys.supplierRecommandation = 0;
  customerKeys.balanceAbacus = 0.0;
  customerKeys.balanceTotal = 0.0;

  return Object.keys(customerKeys);
}

export function getCollectionKey(searchCollection: CollectionEntity): string{
  const statutWorkflow = searchCollection.statutWorkflow ? searchCollection.statutWorkflow.toString() : '' ;
  const key =  searchCollection.collectionType + '-' + statutWorkflow + '-' + searchCollection.status;
  return key;
}

export function getUdfLinkGroup(udfLinks:UserDefinedFieldsLinksEntity[],udfGroups:UserDefinedFieldGroupEntity[],mondatory:boolean){
  let udfLinkGroupLoanList: UDFLinksGroupeFieldsEntity[] = [];

    for(let i =0 ; i< udfGroups.length ; i++ ){
      if(udfGroups[i].enabled){
      let udfGroupeFields : UDFLinksGroupeFieldsModelEntity[]=[];

    udfLinks.filter(link => { return link.userDefinedFieldsDTO?.userDefinedFieldGroupDTO?.id === udfGroups[i].id }).forEach(link=>{
      let udfGroupeField = new UDFLinksGroupeFieldsModelEntity();
      udfGroupeField.value = link.fieldValue;
      udfGroupeField.indexGroup = link.indexGroup;
      udfGroupeField.fieldName = link.userDefinedFieldsDTO.name;
      udfGroupeField.udfFieldID = link.userDefinedFieldsDTO.id;
      udfGroupeField.mandatory = link.userDefinedFieldsDTO.mandatory;
      udfGroupeField.mask = link.userDefinedFieldsDTO.fieldMasc;
      if(link.userDefinedFieldsDTO.fieldType===5 && link.fieldValue){
      const listValue = link.userDefinedFieldsDTO.fieldListValuesDTOs.filter(list => {
        return list.idUDFListValue.toString() === link.fieldValue.toString();
      });

      if(listValue.length > 0){
        udfGroupeField.value =  listValue[0].name;
      }
    }
      udfGroupeFields.push(udfGroupeField);
    })

  let udfLinkGroupLoan = new UDFLinksGroupeFieldsEntity();
  udfLinkGroupLoan.udfGroupeFieldsModels = udfGroupeFields;
  udfLinkGroupLoan.userDefinedFieldGroupID = udfGroups[i].id;
  udfLinkGroupLoan.userDefinedFieldGroupName = udfGroups[i].code;
  udfLinkGroupLoan.mondatory = udfGroups[i].mondatory;
  
  udfLinkGroupLoanList.push(udfLinkGroupLoan);
  }
}
  return udfLinkGroupLoanList;
 }
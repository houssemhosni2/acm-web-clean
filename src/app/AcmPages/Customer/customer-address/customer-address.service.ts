import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressTypeEntity } from '../../../shared/Entities/AddressType.entity';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { AddressSettingAbacusEntity } from '../../../shared/Entities/AddressSettingAbacus.entity';
import { HttpClient } from '@angular/common/http';
import { AddressListEntity } from '../../../shared/Entities/AddressList.entity';
import { AddressSettingEntity } from '../../../shared/Entities/AddressSetting.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }
  /**
   * getAddress type
   */
  getAddressType(): Observable<AddressTypeEntity[]> {
    return this.httpClient.get<AddressTypeEntity[]>(AcmURLConstants.GET_ADDRESS_TYPE);
  }
  /**
   * getAddressSetting
   */
  getAddressSetting(): Observable<AddressSettingAbacusEntity[]> {
    return this.httpClient.get<AddressSettingAbacusEntity[]>(AcmURLConstants.GET_ADDRESS_SETTING);
  }
  /**
   * getAddressList
   * @param list string
   */
  getAddressList(list: string[]): Observable<AddressListEntity[]> {
    return this.httpClient.post<AddressListEntity[]>(AcmURLConstants.GET_ADDRESS_LIST, list);
  }
  /**
   * getAddressListValue
   * @param addressSettingEntity AddressSettingEntity
   */
  getAddressListValue(addressSettingEntity: AddressSettingEntity): Observable<AddressListEntity[]> {
    return this.httpClient.post<AddressListEntity[]>(AcmURLConstants.GET_ADDRESS_LIST_VALUE, addressSettingEntity);
  }

  saveAdresseSetting(addressSettingEntity: AddressSettingEntity): Observable<AddressListEntity> {
    return this.httpClient.post<AddressListEntity>(AcmURLConstants.SAVE_SETTING_ADDRESS, addressSettingEntity);
  }

  updateAdresseSetting(addressSettingEntity: AddressSettingEntity): Observable<AddressListEntity> {
    return this.httpClient.post<AddressListEntity>(AcmURLConstants.UPDATE_SETTING_ADDRESS, addressSettingEntity);
  }

  deleteAdresseSetting(addressSettingEntity: AddressSettingEntity): Observable<AddressListEntity> {
    return this.httpClient.post<AddressListEntity>(AcmURLConstants.DELETE_SETTING_ADDRESS, addressSettingEntity);
  }
  getAddressAllListValue(addressSettingEntity: AddressSettingEntity): Observable<AddressListEntity[]> {
    return this.httpClient.post<AddressListEntity[]>(AcmURLConstants.GET_ALL_ADDRESS_LIST_VALUE, addressSettingEntity);
  }
  getAllAddressType(): Observable<AddressTypeEntity[]> {
    return this.httpClient.get<AddressTypeEntity[]>(AcmURLConstants.GET_ALL_ADDRESS_TYPE);
  }
  deleteTypeAdresseSetting(addressTypeEntity: AddressTypeEntity): Observable<AddressListEntity> {
    return this.httpClient.post<AddressListEntity>(AcmURLConstants.DELETE_TYPE_ADDRESS, addressTypeEntity);
  }
  /**
   * getCustomerAddress
   * @param addressEntity AddressEntity
   */
  getCustomerAddress(addressEntity: AddressEntity): Observable<AddressEntity[]> {
    return this.httpClient.post<AddressEntity[]>(AcmURLConstants.GET_CUSTOMER_ADDRESS, addressEntity);
  }
  getCustomerAddressFromIb(addressEntity: AddressEntity): Observable<AddressEntity[]> {
    return this.httpClient.post<AddressEntity[]>(AcmURLConstants.GET_CUSTOMER_ADDRESS_FROM_IB, addressEntity);
  }


  getCurrentPlace(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.CURRENT_PLACE);
  }
}

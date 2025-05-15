import { SettingThirdPartyEntity } from './settingThirdParty.entity';
export class SettingThirdPartyPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: SettingThirdPartyEntity;
  sortDirection: number;
  sortField: string;
  resultsThirdParties: SettingThirdPartyEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}

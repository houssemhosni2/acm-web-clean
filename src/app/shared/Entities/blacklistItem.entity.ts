import { SettingBalcklistPartyType } from "./settingBlacklistPartyType.entity";

export class BlacklistItem {
    id: number;
    nationalId : string;
    name: string;
    reasonCode: string;
    note: string;
    partyType: SettingBalcklistPartyType;
    status: string;
    enabled: boolean;
    dateInsertion: Date;
    insertBy: string;
}
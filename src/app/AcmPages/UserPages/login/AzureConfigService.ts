import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { AcmEnvironnementEntity } from 'src/app/shared/Entities/acmEnvironnement.entity';
import { AuthConfig } from 'angular-oauth2-oidc';

@Injectable({
    providedIn: 'root'
})
export class AzureConfigService {

    private clientId: string = '';
    private tenantId: string = '';
    private enabled: boolean = false;

    constructor(private httpClient: HttpClient) { }

    loadConfig():
        Observable<AcmEnvironnementEntity[]> {
        return this.httpClient.get<AcmEnvironnementEntity[]>(AcmURLConstants.AUTHENTICATION_LOGIN_OUTLOOK_CONFIG);
    }

    setConfig(clientId: string, tenantId: string, enabled: boolean): void {
        this.clientId = clientId;
        this.tenantId = tenantId;
        this.enabled = enabled;
    }

    getClientId(): string {
        return this.clientId;
    }

    getTenantId(): string {
        return this.tenantId;
    }

    getEnabled(): boolean {
        return this.enabled;
    }

    getAuthConfig(): AuthConfig {
        return {
            issuer: `https://login.microsoftonline.com/${this.getTenantId()}/v2.0`,
            redirectUri: window.location.origin + '/callback',
            clientId: this.getClientId(),
            scope: 'openid profile email',
            responseType: 'code',
            showDebugInformation: true,
            strictDiscoveryDocumentValidation: false,
            sessionChecksEnabled: false
        };
    }
}

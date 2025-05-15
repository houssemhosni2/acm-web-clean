
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { ArchitectUIState, rootReducer } from './ThemeOptions/store';
import { ConfigActions } from './ThemeOptions/store/config.actions';
import { AppRoutingModule } from './app-routing.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';
import { ThemeOptions } from './theme-options';
import { SearchBoxComponent } from './Layout/Components/header/elements/search-box/search-box.component';
import { MegamenuComponent } from './Layout/Components/header/elements/mega-menu/mega-menu.component';
import { MegapopoverComponent } from './Layout/Components/header/elements/mega-menu/elements/megapopover/megapopover.component';
import { LogoComponent } from './Layout/Components/sidebar/elements/logo/logo.component';
import { FooterDotsComponent } from './Layout/Components/footer/elements/footer-dots/footer-dots.component';
import { FooterMenuComponent } from './Layout/Components/footer/elements/footer-menu/footer-menu.component';
// AcmPages
import { AuthentificationInterceptor } from './shared/authentification/authentification.interceptor';
// tslint:disable-next-line:max-line-length
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { LoaderInterceptor } from 'src/app/shared/components/loader/Loader.interceptor';
import { LoaderService } from './shared/components/loader/loader.service';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { NotFoundComponent } from './AcmPages/UserPages/not-found/not-found.component';
import { UnauthorizedComponent } from './AcmPages/UserPages/unauthorized/unauthorized.component';
import { PageTitleModule } from './Layout/Components/page-title/page-title.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { faCog, faEllipsisV, faPencilRuler, faPlus, fas, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { TranslocoRootModule } from './shared/transloco/transloco-root.module'
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { CallbackComponent } from './callback/callback.component';
import { AzureConfigService } from './AcmPages/UserPages/login/AzureConfigService';
import { AcmConstants } from './shared/acm-constants';
import { checkOfflineMode } from './shared/utils';


registerLocaleData(localeFr);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  if(!checkOfflineMode()){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?');
  } 
}

export function initializeApp(azureConfigService: AzureConfigService) {
  return () => azureConfigService.loadConfig().toPromise().then((data: any) => {
    if (data) {
      const [tenantId, clientId] = data.value.split(',');
      azureConfigService.setConfig(clientId, tenantId, data.enabled);
    }
  }).catch((error) => {
    console.error('Error loading Azure configuration:', error);
    return Promise.resolve();
  });
}

const dbConfig: DBConfig = {
  name: 'acmDb',
  version: 3,
  objectStoresMeta: [
    {
      store: 'loans-pagination',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } }, // Manually define the primary key 'id'
        { name: 'pageNumber', keypath: 'pageNumber', options: { unique: false } },
        { name: 'pageSize', keypath: 'pageSize', options: { unique: false } },
        { name: 'params', keypath: 'params', options: { unique: false } },
        { name: 'sortDirection', keypath: 'sortDirection', options: { unique: false } },
        { name: 'sortField', keypath: 'sortField', options: { unique: false } },
        { name: 'resultsLoans', keypath: 'resultsLoans', options: { unique: false } },
        { name: 'totalPages', keypath: 'totalPages', options: { unique: false } },
        { name: 'totalElements', keypath: 'totalElements', options: { unique: false } },
        { name: 'totalAmount', keypath: 'totalAmount', options: { unique: false } },
      ]
    }, {
      store: 'customers-pagination',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'pageNumber', keypath: 'pageNumber', options: { unique: false } },
        { name: 'pageSize', keypath: 'pageSize', options: { unique: false } },
        { name: 'params', keypath: 'params', options: { unique: false } },
        { name: 'sortDirection', keypath: 'sortDirection', options: { unique: false } },
        { name: 'sortField', keypath: 'sortField', options: { unique: false } },
        { name: 'resultsCustomers', keypath: 'resultsCustomers', options: { unique: false } },
        { name: 'totalPages', keypath: 'totalPages', options: { unique: false } },
        { name: 'totalElements', keypath: 'totalElements', options: { unique: false } }
      ]
    }, {
      store: 'collections-pagination',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'pageNumber', keypath: 'pageNumber', options: { unique: false } },
        { name: 'pageSize', keypath: 'pageSize', options: { unique: false } },
        { name: 'params', keypath: 'params', options: { unique: false } },
        { name: 'sortDirection', keypath: 'sortDirection', options: { unique: false } },
        { name: 'sortField', keypath: 'sortField', options: { unique: false } },
        { name: 'resultsCollections', keypath: 'resultsCollections', options: { unique: false } },
        { name: 'totalPages', keypath: 'totalPages', options: { unique: false } },
        { name: 'totalElements', keypath: 'totalElements', options: { unique: false } },
        { name: 'totalAmount', keypath: 'totalAmount', options: { unique: false } },
      ]
    },
    {
      store: 'SelectItem',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } }, // Manually define the primary key 'id'
        { name: 'SelectItems', keypath: 'SelectItems', options: { unique: false } }
      ]
    },
    {
      store: 'customers',
      storeConfig: { keyPath: 'itemId', autoIncrement: true },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'prospects',
      storeConfig: { keyPath: 'itemId', autoIncrement: true },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'loans',
      storeConfig: { keyPath: 'loanId', autoIncrement: true },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'newLoean', keypath: 'data', options: { unique: false } }
      ]
    },{
      store: 'collections',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'collection', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'calculate-loans',
      storeConfig: { keyPath: 'loanId', autoIncrement: true },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'data',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } }, // Manually define the primary key 'id'
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'documents',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } }, // Manually define the primary key 'id'
        { name: 'uploadedFiles', keypath: 'uploadedFiles', options: { unique: false } },
        { name: 'documentsLoanDTO', keypath: 'documentsLoanDTO', options: { unique: false } }
      ]
    },{
      store: 'udfLinks',
      storeConfig: { keyPath: 'elementId', autoIncrement: false },
      storeSchema: [
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'udfLink', keypath: 'data', options: { unique: false } }
      ]
    },{
      store: 'notes',
      storeConfig: { keyPath: 'elementId', autoIncrement: false },
      storeSchema: [
        { name: 'elementNote', keypath: 'elementNote', options: { unique: false } }
      ]
    },{
      store: 'tasks',
      storeConfig: { keyPath: 'elementId', autoIncrement: false },
      storeSchema: [
        { name: 'elementTasks', keypath: 'elementTasks', options: { unique: false } }
      ]
    },{
      store: 'collaterals',
      storeConfig: { keyPath: 'loanId', autoIncrement: false },
      storeSchema: [
        { name: 'loanCollateral', keypath: 'loanCollateral', options: { unique: false } }
      ]
    },{
      store: 'conditionalApproves',
      storeConfig: { keyPath: 'loanId', autoIncrement: false },
      storeSchema: [
        { name: 'conditionalApproves', keypath: 'conditionalApproves', options: { unique: false } }
      ]
    },{
      store: 'guarantors',
      storeConfig: { keyPath: 'loanId', autoIncrement: false },
      storeSchema: [
        { name: 'guarantors', keypath: 'guarantors', options: { unique: false } }
      ]
    }]
};

@NgModule({
  declarations: [
    // LAYOUT
    AppComponent,
    PagesLayoutComponent,
    // HEADER
    SearchBoxComponent,
    MegamenuComponent,
    MegapopoverComponent,
    // SIDEBAR
    LogoComponent,
    // FOOTER
    FooterDotsComponent,
    FooterMenuComponent,
    // User Pages
    NotificationsComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    CallbackComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SelectDropDownModule,
    PageTitleModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgReduxModule,
    CommonModule,
    LoadingBarRouterModule,
    // SSO
    OAuthModule.forRoot(),
    // Angular Bootstrap Components
    PerfectScrollbarModule,
    NgbModule,
    FontAwesomeModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // Service worker
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxIndexedDBModule.forRoot(dbConfig),
    TranslocoRootModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [
    {
      provide:
        PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
        DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    },
    ConfigActions,
    ThemeOptions,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthentificationInterceptor,
      multi: true,
    },
    DatePipe,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    AzureConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AzureConfigService],
      multi: true
    },
    {
      provide: AuthConfig,
      useFactory: (azureConfigService: AzureConfigService) => azureConfigService.getAuthConfig(),
      deps: [AzureConfigService]
    }
  ],

  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(public ngRedux: NgRedux<ArchitectUIState>,
    public devTool: DevToolsExtension, public library: FaIconLibrary) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : f => f]
    );
    library.addIconPacks(fas);
    library.addIcons(faPlus);
    library.addIcons(faPencilRuler);
    library.addIcons(faTrash);
    library.addIcons(faEllipsisV);
    library.addIcons(faCog);
  }
}

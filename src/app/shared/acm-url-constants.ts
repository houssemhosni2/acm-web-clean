/**
 * ACM URLs Constants.
 */
import { environment } from '../../environments/environment';

export class AcmURLConstants {
  public static readonly AUTHENTICATION_SERVICE = environment.oauthUrl + 'services/parametrageservice/api';
  public static readonly CREDIT_SERVICE = environment.apiUrl + 'services/creditservice/api';
  public static readonly PARAMETRAGE_SERVICE = environment.apiUrl + 'services/parametrageservice/api';
  public static readonly GED_SERVICE = environment.apiUrl + 'services/gedservice/api';
  public static readonly CRM_SERVICE = environment.apiUrl + 'services/crmservice/api';
  public static readonly REPORTING_SERVICE = environment.apiUrl + 'services/reportingservice/api';
  public static readonly EXPENSES_SERVICE = environment.apiUrl + 'services/expensesservice/api';
  public static readonly INCENTIVE_SERVICE = environment.apiUrl + 'services/incentiveservice/api';
  public static readonly TRANSVERSE_SERVICE = environment.apiUrl + 'services/transversservice/api';
  public static readonly AML_SERVICE = environment.apiUrl + 'services/amlservice/api';

  // API CURRENT PLACE
  public static readonly CURRENT_PLACE = 'http://ip-api.com/json';

  /**
   * AUTHENTICATION_SERVICE
   */
  public static readonly AUTHENTICATION_URL_API = AcmURLConstants.AUTHENTICATION_SERVICE + 'oauth/token?';
  public static readonly AUTHENTICATION_LOGIN_API = AcmURLConstants.AUTHENTICATION_SERVICE + 'authenticate';
  public static readonly AUTHENTICATION_LOGIN_OUTLOOK = AcmURLConstants.AUTHENTICATION_SERVICE + 'login/sso';
  public static readonly AUTHENTICATION_LOGIN_OUTLOOK_CONFIG = AcmURLConstants.AUTHENTICATION_SERVICE + 'login/outlook-config';

  public static readonly USER_PARAMETRAGE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/connected';
  public static readonly LOAD_USERS_ALL_HIERARCHICAL_TYPE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/findUsers';
  public static readonly LOAD_FULL_USERS_LIST = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/find-full-list';
  public static readonly RESET_PWD = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/forget-pwd/';
  public static readonly UPDATE_PWD = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/update-pwd/';
  public static readonly FIND_USERS = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/';
  public static readonly FIND_COUNT_USERS = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/count-user';
  public static readonly FIND_SIMULTANIOUS_USERS = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/simultanious-user';




  // SETTING USERS
  public static readonly SETTING_USER_FIND = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/find-all';
  public static readonly SETTING_USER_ENABLE_UPDATE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/enable';
  public static readonly SETTING_USER_UPDATE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/update';
  public static readonly SETTING_USER_CREATE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/create';
  public static readonly GET_ACCOUNT_PORTFOLIO = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/';
  public static readonly SETTING_USER_PAGINATION = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/find-pagination';
  public static readonly SETTING_Portfolio_PAGINATION = AcmURLConstants.PARAMETRAGE_SERVICE + '/portfolio/find-pagination';
  public static readonly FIND_All_PORTFOLIO = AcmURLConstants.PARAMETRAGE_SERVICE + '/portfolio/find-all';
  public static readonly SETTING_GET_PORTFOLIO = AcmURLConstants.PARAMETRAGE_SERVICE + '/portfolio/';
  public static readonly SETTING_PORTFOLIO_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/portfolio/create';

  public static readonly UPDATE_DEFAULT_LANG = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/set-default-lang';
  public static readonly UPDATE_USERS_RESPONSIBLE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/update-users-responsible';
  // PORTFOLIO
  public static readonly FIND_PORTFOLIO = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/find-portfolio';
  public static readonly GET_USERS_BRANCH = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/findUsersBranch';
  public static readonly FIND_RESPONSIBLE = AcmURLConstants.AUTHENTICATION_SERVICE + '/users/find-responsible';
  public static readonly FIND_PORTFOLIOById = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/portfolio/';

  public static readonly CHECK_RESPONSIBLE_LOOP = AcmURLConstants.AUTHENTICATION_SERVICE + 'users/ckeck-users-responsible-loop';

  /**
   * CREDIT_SERVICE
   */
  public static readonly FIND_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/';
  public static readonly FIND_LOAN_BY_EXTERNALID = AcmURLConstants.CREDIT_SERVICE + '/loans/find-by-idExtern/';
  public static readonly FIND_LOANS_BY_ACCOUNT = AcmURLConstants.CREDIT_SERVICE + '/loans/by-account';
  public static readonly FIND_LOANS_BY_CUSTOMERID = AcmURLConstants.CREDIT_SERVICE + '/loans/find-by-customerID/';
  public static readonly FIND_LOANS_BY_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/loans/find-by-customer/';
  public static readonly FIND_LOANS_PAGINATIONS = AcmURLConstants.CREDIT_SERVICE + '/loans/find-pagination';
  public static readonly COUNT_LOANS_MY_TASK = AcmURLConstants.CREDIT_SERVICE + '/loans/count-my-task';
  public static readonly COUNT_LOANS_STATUS_TAB_NEW = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-new';
  public static readonly COUNT_LOANS_STATUS_TAB_DRAFTS = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-drafts';
  public static readonly COUNT_LOANS_STATUS_TAB_PENDING_APPROVAL = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-pendingApproval';
  public static readonly COUNT_LOANS_STATUS_TAB_APPROVED = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-approved';
  public static readonly COUNT_LOANS_STATUS_TAB_REJECTED = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-rejected';
  public static readonly COUNT_LOANS_STATUS_TAB_CANCELLED = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-cancelled';
  public static readonly COUNT_LOANS_STATUS_TAB_REVIEW = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-review';
  public static readonly COUNT_LOANS_STATUS_TAB_UNASSIGNED = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-unassigned';
  public static readonly COUNT_LOANS_STATUS_TAB_ISSUED = AcmURLConstants.CREDIT_SERVICE + '/loans/count-tab-issued';
  public static readonly SYNCHRONIZE_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/get-new-loans-from-abacus';
  public static readonly LOAN_DETAILS = AcmURLConstants.CREDIT_SERVICE + '/loans/data-abacus/loan-details/';
  public static readonly VALIDATE_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/validate';
  public static readonly LOAN_REVIEWS = AcmURLConstants.CREDIT_SERVICE + '/loans/loan-review';
  public static readonly VALIDATE_LOAN_READY_DISBURSEMENT = AcmURLConstants.CREDIT_SERVICE + '/loans/validate-for-disbusrsement';
  public static readonly VALIDATE_ALL_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/validate-all';
  public static readonly AUTOMATIC_STEP_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/automatic-step';
  public static readonly FIND_LOAN_BY_IB_ID = AcmURLConstants.CREDIT_SERVICE + '/loans/find-by-idIbLoan/';

  // tslint:disable-next-line:max-line-length 
  public static readonly CALCULATE_LOAN_SCHEDULES = AcmURLConstants.CREDIT_SERVICE + '/loans/load-data-api-abacus/calculate-loan-schedules';
  public static readonly LOAN_SCHEDULES = AcmURLConstants.CREDIT_SERVICE + '/loans/data-abacus/customer-account-schedule/';
  public static readonly REASSIGN_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/reassigned';
  public static readonly CREATE_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/create-to-abacus';
  public static readonly CREATE_TOPUP_REFINANCE_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/refinance-loan';
  public static readonly UPDATE_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/update-loan';
  public static readonly UPDATE_LOAN_GROUP = AcmURLConstants.CREDIT_SERVICE + '/loans/update-loan-group';
  public static readonly UPDATE_LOAN_ASSIGN_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/loans/update-assign-customer';
  public static readonly CREATE_LOAN_GROUP = AcmURLConstants.CREDIT_SERVICE + '/loans/create-loan-grp-to-abacus';
  public static readonly REJECT_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/rejected';
  public static readonly CANCEL_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/cancelled';
  public static readonly UPDATE_ACM_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/update-child-and-grp';
  public static readonly CHECK_ISSUED_STATUS = AcmURLConstants.CREDIT_SERVICE + '/loans/check-issued-status/';
  public static readonly UPDATE_LOAN_STATUS = AcmURLConstants.CREDIT_SERVICE + '/loans/update-status';
  public static readonly CLOSE_BALANCE_ISSUED_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/get-closing-balance-by-idExtern/';

  // Analytics
  public static readonly TOTAL_APPLIED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-applied-loans';
  public static readonly TOTAL_APPROVED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-approved-loans';
  public static readonly TOTAL_CANCELED_REJECTED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-canceled-rejected-loans';
  public static readonly COUNT_LOANS_PRODUCTS = AcmURLConstants.CREDIT_SERVICE + '/analytics/count-loans-products';
  public static readonly COUNT_LOANS_BY_MONTHS = AcmURLConstants.CREDIT_SERVICE + '/analytics/loans-stat-months';
  public static readonly TOTAL_LOANS_AMOUNT = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-loans-amount';
  public static readonly TOTAL_CUSTOMERS = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-customers';
  public static readonly TOTAL_ACTIVE_CUSTOMERS = AcmURLConstants.CREDIT_SERVICE + '/analytics/total-active-customers';
  public static readonly COUNT_LOANS_AMOUNT_BY_MONTHS = AcmURLConstants.CREDIT_SERVICE + '/analytics/loans-amount-stat-months';
  public static readonly COUNT_CUSTOMERS_BY_MONTHS = AcmURLConstants.CREDIT_SERVICE + '/analytics/customers-stat-months';

  // Report Visits
  public static readonly GET_REPORT_VISIT = AcmURLConstants.CREDIT_SERVICE + '/report-visits/';
  public static readonly CREATE_REPORT_VISIT = AcmURLConstants.CREDIT_SERVICE + '/report-visits/create';
  // Guarantor
  public static readonly LOAN_GUARANTOR = AcmURLConstants.CREDIT_SERVICE + '/loans/data-abacus/guarantors/';
  public static readonly LOAN_COLLATERAL = AcmURLConstants.CREDIT_SERVICE + '/loans/data-abacus/collaterols/';
  public static readonly GET_ALL_LOAN_COLLATERAL = AcmURLConstants.CREDIT_SERVICE + '/loans/all-collateralls';
  public static readonly ADD_GUARANTORS = AcmURLConstants.CREDIT_SERVICE + '/guarantors/add-guarantors';

  // FINANCIAL ANALYSIS
  public static readonly LOAN_FINANCIAL_ANALYSIS = AcmURLConstants.CREDIT_SERVICE + '/loans/data-abacus/financialanalysis/';
  public static readonly LOAN_FINANCIAL_ANALYSIS_NEW = AcmURLConstants.REPORTING_SERVICE + '/reporting/calculate_financial_report';

  // CUSTOMER_DECISION
  public static readonly LOAN_CUSTOMER_DECISION_FIND = AcmURLConstants.CREDIT_SERVICE + '/customer-decision/';
  public static readonly LOAN_CUSTOMER_DECISION_CREATE = AcmURLConstants.CREDIT_SERVICE + '/customer-decision/create';
  public static readonly LOAN_CUSTOMER_DECISION_UPDATE = AcmURLConstants.CREDIT_SERVICE + '/customer-decision/update';
  // CUSTOMER LIST
  public static readonly GET_CUSTOMERS = AcmURLConstants.CREDIT_SERVICE + '/customers/find-customers';
  public static readonly GET_CUSTOMERS_FOR_GROUP = AcmURLConstants.CREDIT_SERVICE + '/customers/find-customers-for-group';
  public static readonly FIND_CUSTOMERS = AcmURLConstants.CREDIT_SERVICE + '/customers/';

  public static readonly GET_CUSTOMERS_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/customers/find-pagination';
  public static readonly GET_CUSTOMERS_ACCOUNT_BY_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/customer-account/';
  public static readonly GET_PAYMENT_ALLOCATION_CUSTOMERS_BY_CUSTOMER_ACCOUNT = AcmURLConstants.CREDIT_SERVICE + '/customers/find-schedule-by-customer/';
  public static readonly SAVE_CUSTOMER_FOR_APPLICATION = AcmURLConstants.CREDIT_SERVICE + '/customers/save-for-application';
  public static readonly UPDATE_CUSTOMER_FOR_APPLICATION = AcmURLConstants.CREDIT_SERVICE + '/customers/update-for-application';
  public static readonly UPDATE_PHOTO_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/upload-photo/';
  public static readonly GET_PHOTO_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/photo-customer/';
  public static readonly GET_CUSTOMER_DETAILS_ACM = AcmURLConstants.CREDIT_SERVICE + '/customers/';
  public static readonly GET_CUSTOMER_LINKS_RELATIONSHIP = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/';
  public static readonly GET_GUARANTOR_FROM_IB_AND_SAVE_IN_ACM = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/find-guarantors-from-ib-and-save-in-acm';
  public static readonly CHECK_EXIST_CUSTOMER_BY_PHONE_NUMBER = AcmURLConstants.CREDIT_SERVICE + '/customers/check-phone-number/';
  public static readonly CHECK_EXIST_LOAN_ISSUE_FOR_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/check-loan-issued';
  public static readonly GET_ALL_LOAN_GUARANTORS = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/find-all-loan-guarantors';
  public static readonly GET_GUARANTEES = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/find-guarantees';
  public static readonly LINKS_RELATIONSHIP_DELETE_GUARANTOR = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/delete-guarantor';
  public static readonly GET_CUSTOMER_DETAILS_ACM_EXTRN_ID = AcmURLConstants.CREDIT_SERVICE + '/customers/find-customer-by-id-extern/';
  public static readonly GET_CUSTOMER_DETAILS_ACM_FOR_CLAIMS = AcmURLConstants.CREDIT_SERVICE + '/customers/forClaims/';

  // tslint:disable-next-line:max-line-length
  public static readonly GET_CUSTOMER_ACTIVE_GUARANTOR = AcmURLConstants.CREDIT_SERVICE + '/customer-link-relationship/customer-active-guarantor';
  public static readonly GET_CUSTOMER_ADDRESS = AcmURLConstants.CREDIT_SERVICE + '/address/';
  public static readonly GET_CUSTOMER_MEMBERS_DETAILS = AcmURLConstants.CREDIT_SERVICE + '/customers/find-customer-by-members';
  public static readonly GET_CUSTOMER_ACTIVE_ACCOUNT = AcmURLConstants.CREDIT_SERVICE + '/customers/customer-active-account/';
  public static readonly SAVE_ALL_CUSTOMER_ADDRESS = AcmURLConstants.CREDIT_SERVICE + '/address/update-all';
  public static readonly GET_ADDRESS_HISTORQUE = AcmURLConstants.CREDIT_SERVICE + '/address-historique/';
  public static readonly GET_CUSTOMER_PAID_ACCOUNT = AcmURLConstants.CREDIT_SERVICE + '/customers/customer-paid-account/';
  // tslint:disable-next-line:max-line-length
  public static readonly GET_ALL_ACTIVE_ACCOUNTS_FOR_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/find-all-active-accounts-for-customer/';
  public static readonly GET_CUSTOMER_FOR_LINK = AcmURLConstants.CREDIT_SERVICE + '/customers/find-pagination-for-link';
  public static readonly GET_CUSTOMER_ARREARS = AcmURLConstants.CREDIT_SERVICE + '/customers/data-abacus/customer-arrears/';
  public static readonly CHECK_MAX_ACTIVE_ACCOUNT_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customers/check-max-account-by-customer/';
  // tslint:disable-next-line:max-line-length
  public static readonly GET_CUSTOMER_PAGINATION_FOR_MEZA_CARD = AcmURLConstants.CREDIT_SERVICE + '/customers/find-pagination-for-meza-card';
  public static readonly COUNT_CUSTOMER_MEZA_CARD = AcmURLConstants.CREDIT_SERVICE + '/customers/count';
  public static readonly UPDATE_ALL_CUSTOMER_MEZA_CARD = AcmURLConstants.CREDIT_SERVICE + '/customers/update-all-customer-meza-card';
  public static readonly CREATE_PROSPECT = AcmURLConstants.CREDIT_SERVICE + '/customers/create';
  public static readonly UPDATE_PROSPECT = AcmURLConstants.CREDIT_SERVICE + '/customers/update';
  public static readonly CREATE_CUSTOMER_IB = AcmURLConstants.CREDIT_SERVICE + '/customers/create_customer_IB';

  // NOTIFICATION
  public static readonly USER_NOTIFICATION_CREATE = AcmURLConstants.CREDIT_SERVICE + '/user-notifications/create/';
  public static readonly NOTIFICATION_FIND = AcmURLConstants.CREDIT_SERVICE + '/notifications/';
  public static readonly NOTIFICATION_FIND_NEW = AcmURLConstants.CREDIT_SERVICE + '/notifications/find-notifications';
  public static readonly NOTIFICATION_UPDATE = AcmURLConstants.CREDIT_SERVICE + '/notifications/update';
  public static readonly USER_NOTIFICATION_SETTING_FIND = AcmURLConstants.CREDIT_SERVICE + '/user-notifications/findByUser';
  public static readonly USER_NOTIFICATION_UPDATE_STATUT = AcmURLConstants.CREDIT_SERVICE + '/user-notifications/update';
  public static readonly NOTIFICATION_COUNT_NEW = AcmURLConstants.CREDIT_SERVICE + '/notifications/count-notifications';
  // LOAN DOCUMENT SERVICE
  public static readonly SAVE_LIST_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/saveToGed';
  public static readonly GET_LIST_DOCUMENT_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/';
  public static readonly GET_LIST_DOCUMENT_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/find-documents-customer/';
  public static readonly CREATE_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/create';
  public static readonly UPDATE_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/update-document-list';
  public static readonly DELETE_DOCUMENT_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/delete/';
  public static readonly DISABLE_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/disable-document';
  public static readonly GET_ALL_TYPES_DOCUMENT_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/find-pagination';
  public static readonly SAVE_IMAGE_IN_GED = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/save-image-to-ged';
  // LOAN APPROVAL HISTORIQUE
  public static readonly GET_LOAN_APPROVAL_HISTORIQUE = AcmURLConstants.CREDIT_SERVICE + '/loan-approval-historiques/';
  // CUSTOMER NOTE
  public static readonly GET_CUSTOMER_NOTE = AcmURLConstants.CREDIT_SERVICE + '/customer-decision/';
  // LOAN HISTORIQUE NOTES
  public static readonly GET_LOAN_HISTORIQUE_NOTES = AcmURLConstants.CREDIT_SERVICE + '/loan-historiques/notes';
  public static readonly GET_LOAN_HISTORIQUE = AcmURLConstants.CREDIT_SERVICE + '/loan-historiques/';
  // GET REQUIRED DOCUMENT
  public static readonly GET_REQUIRED_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans/findRequiredDocument';
  // load list using in dashboard filter
  public static readonly LOAD_FILTER_STATUS_WORKFLOW = AcmURLConstants.CREDIT_SERVICE + '/loans/load-filter-status-workflow';
  public static readonly LOAD_FILTER_STATUS_UNASSIGNED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/load-filter-status-loans_unassigned';
  public static readonly LOAD_FILTER_PRODUCT = AcmURLConstants.CREDIT_SERVICE + '/loans/load-filter-product';
  public static readonly LOAD_FILTER_PRODUCT_UNASSIGNED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/load-filter-product-loans_unassigned';
  public static readonly LOAD_FILTER_BRANCH = AcmURLConstants.CREDIT_SERVICE + '/loans/load-filter-branch';
  // udf links
  public static readonly CREATE_UDF_LINK = AcmURLConstants.CREDIT_SERVICE + '/udf-links/create';
  public static readonly UPDATE_UDF_LINK = AcmURLConstants.CREDIT_SERVICE + '/udf-links/update';
  public static readonly CREATE_ALL_UDF_LINK = AcmURLConstants.CREDIT_SERVICE + '/udf-links/create-all';
  public static readonly GET_ALL_UDF_LINK = AcmURLConstants.CREDIT_SERVICE + '/udf-links/';
  public static readonly GET_ALL_UDF_LINK_GROUP = AcmURLConstants.CREDIT_SERVICE + '/udf-links/find-udf-groupby/';

  public static readonly GET_UDF_LOANS_BY_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/udf-links/find-udf-loans-bycustomer/';
  // IB Loan
  public static readonly LOAD_LOAN_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/';
  public static readonly ASSIGN_LOAN_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/assigned-all';
  public static readonly UPDATE_LOAN_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/update';
  public static readonly FIND_LOANS_IB_PAGINATIONS = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/find-ib-pagination';
  public static readonly LOAD_FILTER_PRODUCT_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/load-filter-product-ib';
  public static readonly ACCEPT_LOAN_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/accept';
  public static readonly COUNT_LOANS_IB = AcmURLConstants.CREDIT_SERVICE + '/loans-ib/count';
  // fee repayment(admin fee)
  public static readonly GET_FEE_REPAYMENT = AcmURLConstants.CREDIT_SERVICE + '/loans/load-data-abacus/fee-repayment/';
  // application fee
  public static readonly GET_APPLICATION_FEE = AcmURLConstants.CREDIT_SERVICE + '/loans/load-data-abacus/application-fee/';
  // Third Party
  public static readonly THIRD_PARTY_HISTORY_LIST = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/';
  public static readonly THIRD_PARTY_HISTORY_BY_LOAN = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/idLoan/';

  // tslint:disable-next-line:max-line-length
  public static readonly THIRD_PARTY_HISTORY_LIST_SCREENING = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/find-for-screening';
  public static readonly THIRD_PARTY_VALIDATE = AcmURLConstants.CREDIT_SERVICE + '/third-party/validate';
  public static readonly THIRD_PARTY_CONFIRM = AcmURLConstants.CREDIT_SERVICE + '/third-party/confirm';
  public static readonly THIRD_PARTY_CHECK_AML = AcmURLConstants.CREDIT_SERVICE + '/third-party/check-aml';
  public static readonly THIRD_PARTY_CHECK_ISCORE = AcmURLConstants.CREDIT_SERVICE + '/third-party/check-iscore';
  public static readonly THIRD_PARTY_DOWNLOAD_REPPORT = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/report-iscore';
  public static readonly THIRD_PARTY_CHECK_RUN_ISCORE = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/run-iscore/';
  public static readonly THIRD_PARTY_HISTORY_VALIDATE = AcmURLConstants.CREDIT_SERVICE + '/third-party-historiques/validate';

  //AML
  public static readonly CALL_CHECK_CUSTOMER_AML = AcmURLConstants.AML_SERVICE + '/aml/check-customer';
  public static readonly CALL_SAVE_CHECK_AML = AcmURLConstants.AML_SERVICE + '/aml/save-aml-checks';
  public static readonly CALL_FIND_CHECK_AML = AcmURLConstants.AML_SERVICE + '/aml/find-aml-check';
  public static readonly CALL_FIND_DOUBTFUL_TRANSACTION = AcmURLConstants.AML_SERVICE + '/aml/find-doubtful-transaction';
  public static readonly UPDATE_AML_CHECK = AcmURLConstants.AML_SERVICE + '/aml/update-aml-check';



  // EMAIL
  public static readonly SEND_MAIL_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customer-contact/create-mail';
  public static readonly FIND_MAIL_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customer-contact/';
  public static readonly UPDATE_MAIL_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/customer-contact/update';
  // Load STATUS LOAN WORKFLOW
  public static readonly LOAD_STATUS_WORKFLOW = AcmURLConstants.CREDIT_SERVICE + '/loans/status';
  // Load STATUS LOAN FROM ABACUS (USED in reporting)
  public static readonly LOAD_STATUS_ABACUS = AcmURLConstants.CREDIT_SERVICE + '/loans/status-loan-abacus';
  public static readonly RESEND_LOGIN = AcmURLConstants.CREDIT_SERVICE + '/customers/resend-login';
  public static readonly CREATE_FILTRE = AcmURLConstants.CREDIT_SERVICE + '/report-search-history/create';
  public static readonly FIND_FILTRE = AcmURLConstants.CREDIT_SERVICE + '/report-search-history/';
  public static readonly FIND_UNASSIGNED_PAGINATIONS = AcmURLConstants.CREDIT_SERVICE + '/loans/find-unassigned-pagination';
  public static readonly ASSIGN_LOAN = AcmURLConstants.CREDIT_SERVICE + '/loans/assign-loan';

  // Synchronize loans between ACM and ABACUS
  public static readonly SYNCHRONIZE_ISSUED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/synchronize-issued-loans-abacus-acm';
  public static readonly SYNCHRONIZE_CANCELLED_LOANS = AcmURLConstants.CREDIT_SERVICE + '/loans/synchronize-cancelled-loans-abacus-acm';
  public static readonly SYNCHRONIZE_LOAN_BY_ACCOUNT_NUMBER = AcmURLConstants.CREDIT_SERVICE + '/loans/get-loan-from-abacus-by-accountNumber/';
  public static readonly SYNCHRONIZE_CUSTOMERS = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/import-customers-job';
  public static readonly SYNCHRONIZE_PORTFOLIO = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/syncronized-portfolio-job';
  public static readonly SYNCHRONIZE_CUSTOMER_BRANCHES = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/update-customers-branches';
  public static readonly SYNCHRONIZE_COLLECTIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/get-collection-by-batch';
  public static readonly SYNCHRONIZE_AML = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/customer-aml-check';
  public static readonly SYNCHRONIZE_DOUBTFUL_LOAN = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/doubtful-transactions-job';



  // MEZA CARD
  public static readonly UPLOAD_FILE = AcmURLConstants.CREDIT_SERVICE + '/meza-card/upload-meza-card-file';
  public static readonly FIND_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/meza-card/find-pagination';
  public static readonly SAVE_CARDS = AcmURLConstants.CREDIT_SERVICE + '/meza-card/update-cards';
  // tslint:disable-next-line:max-line-length
  public static readonly FIND_FIRST_MEZA_CARD_ORDER_BY_ACCOUNT = AcmURLConstants.CREDIT_SERVICE + '/meza-card/find-first-order-by-cardNumber';
  public static readonly REPORTING_MEZA_CARD = AcmURLConstants.CREDIT_SERVICE + '/meza-card/report-meza-card';

  /**
   * CRM_SERVICE
   */
  // CALENDAR
  public static readonly CALENDAR_EVENT_CREATE = AcmURLConstants.CRM_SERVICE + '/calendar-events/create';
  public static readonly CALENDAR_EVENT_UPDATE = AcmURLConstants.CRM_SERVICE + '/calendar-events/update';
  public static readonly CALENDAR_EVENT_FIND = AcmURLConstants.CRM_SERVICE + '/calendar-events/';
  public static readonly CALENDAR_EVENT_FIND_PAGINATION = AcmURLConstants.CRM_SERVICE + '/calendar-events/find-pagination';
  public static readonly CALENDAR_EVENT_CLOSE = AcmURLConstants.CRM_SERVICE + '/calendar-events/closeTask';
  /*
  *   GED_SERVICE
   */
  public static readonly DISPLAY_DOCUMENT = AcmURLConstants.GED_SERVICE + '/documents/display/';
  public static readonly FIND_DOCUMENTS_BY_TAGS = AcmURLConstants.GED_SERVICE + '/documents/find-by-tags';
  public static readonly GET_DETAIL_DOCUMENT = AcmURLConstants.GED_SERVICE + '/documents/document/';
  public static readonly FIND_IMAGE_FOR_CUSTOMER = AcmURLConstants.GED_SERVICE + '/documents/find-image-for-customer/';
  public static readonly SAVE_DOCUMENT_IN_GED = AcmURLConstants.GED_SERVICE + '/documents-ged/disable-all/';
  public static readonly FIND_DOCUMENTS = AcmURLConstants.GED_SERVICE + '/documents-ged/';
  public static readonly COUNT_BACKUP_GED_DOCUMENTS = AcmURLConstants.GED_SERVICE + '/documents-ged/count-all';
  public static readonly UPDATE_PHOTO_CLIENT = AcmURLConstants.GED_SERVICE + '/documents-ged/upload-photo-client/';
  public static readonly FIND_PHOTO_CLIENT = AcmURLConstants.GED_SERVICE + '/documents-ged/photo-client/';
  /**
   * REPORTING_SERVICES
   */
  // EDITION
  public static readonly GENERATE_LOAN_REPORT = AcmURLConstants.REPORTING_SERVICE + '/edition/generatePDF/loanReport';
  public static readonly GENERATE_CUSTOM_REPORT = AcmURLConstants.REPORTING_SERVICE + '/edition/generate-report';
  public static readonly REPORTING_LOAN_APPLICATION = AcmURLConstants.REPORTING_SERVICE + '/reporting/excel/loan-application';
  public static readonly REPORTING_COLLECTION_FOLLOW_UP = AcmURLConstants.REPORTING_SERVICE + '/reporting/excel/collection-follow-up';
  public static readonly REPORTING_AML = AcmURLConstants.REPORTING_SERVICE + '/reporting/report-aml-excel';
  public static readonly REPORTING_SCHEDULE = AcmURLConstants.REPORTING_SERVICE + '/reporting/report-schedule-excel';
  // I-SCORE
  public static readonly GENERATE_FILE = AcmURLConstants.REPORTING_SERVICE + '/i-score/file/';
  public static readonly GET_REJECT_FILE = AcmURLConstants.REPORTING_SERVICE + '/i-score/rejectfile';

  /**
   * SETTING_SERVICES
   */
  public static readonly GET_MOTIF_REJETS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/';
  public static readonly GET_HABILITATION_USER = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/';
  public static readonly GET_ABACUS_ALL_MOTIFS_DE_REJET = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/find-all-abacus';
  public static readonly ADD_REASON_EXPENSES = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/create';
  public static readonly UPDATE_REASON = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/update';
  public static readonly DELETE_REASON = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/delete/';
  public static readonly FIND_WORK_FLOW_LOAN = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/get-work-flow-step/';


  // PRODUCT
  public static readonly LIST_ALL_PRODUCTS = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/find-all';
  public static readonly PRODUCT_DETAILS = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/';
  public static readonly PRODUCT_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/update';
  public static readonly ELIGIBLE_PRODUCTS = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/eligible-products';
  public static readonly CREATE_PRODUCT_DETAILS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-details/create';
  public static readonly UPDATE_PRODUCT_DETAILS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-details/update';
  public static readonly DELETE_PRODUCT_DETAILS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-details/';
  public static readonly CREATE_PRODUCT_FILTERS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-filter/create';
  public static readonly UPDATE_PRODUCT_FILTERS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-filter/update';
  public static readonly FIND_PRODUCT_FILTERS = AcmURLConstants.PARAMETRAGE_SERVICE + '/product-filter/';
  // GROUPE_MANAGEMENT
  public static readonly GROUP_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/create';
  public static readonly GROUP_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/update';
  public static readonly GROUP_UPDATE_ENABLED = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/update-enabled';
  public static readonly GROUP_UPDATE_LinkedPortfolio = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/update-linked';
  public static readonly GROUP_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/';
  public static readonly GROUP_FIND_ALL = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/find-all';
  public static readonly FIND_GROUPES_PAGINATIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/groupes/find-groupe-pagination';
  // Setting_Guarantor_Collateral
  public static readonly SETTING_GUARANTOR_COLLATERAL_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-gurantor-collateral/';
  public static readonly SETTING_GUARANTOR_COLLATERAL_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-gurantor-collateral/update';
  public static readonly SETTING_GUARANTOR_COLLATERAL_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-gurantor-collateral/create';
  // SETTING DOCUMENT TYPE
  public static readonly FIND_ALL_TYPES_DOCUMENT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/find-all';
  // tslint:disable-next-line:max-line-length
  public static readonly FIND_DOCUMENT_TYPE_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/document-type-category';
  public static readonly CREATE_DOCUMENT_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/create';
  public static readonly UPDATE_DOCUMENT_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/update';
  public static readonly DISABLE_DOCUMENT_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/disable-document-type';
  public static readonly ENABLE_DOCUMENT_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/enable-document-type';
  public static readonly GET_ALL_TYPES_DOCUMENT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/';
  // SETTING DOCUMENT PRODUCT
  public static readonly FIND_ALL_DOCUMENT_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-products/';
  // tslint:disable-next-line:max-line-length
  public static readonly DISABLE_DOCUMENT_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-products/disable-document-product';
  // tslint:disable-next-line:max-line-length
  public static readonly ENABLE_DOCUMENT_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-products/enable-document-product';
  public static readonly UPDATE_DOCUMENT_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-products/update';
  // Setting_Motifs_Rejects
  public static readonly SETTING_MOTIFS_REJECTS_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/find-all';
  public static readonly SETTING_MOTIFS_REJECTS_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/update';
  public static readonly SETTING_MOTIFS_REJECTS_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/create';
  public static readonly GET_ENABLED_DISABLED_MOTIF_REJETS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-motif-rejets/find-enabled-and-disabled';
  // Setting_Claims
  public static readonly SETTING_CLAIMS_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-claims/find-all';
  public static readonly SETTING_CLAIMS_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-claims/update';
  public static readonly SETTING_CLAIMS_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-claims/create';
  // Claim_Notes
  public static readonly GET_CLAIM_NOTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/claim-note/';
  public static readonly CREATE_CLAIM_NOTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/claim-note/create';

  public static readonly SETTING_CLAIMS_FIND_BY_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-claims/';
  //Setting Charge fee
  public static readonly SETTING_CHARGE_FEE_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-charge-fee/';
  public static readonly SETTING_CHARGE_FEE_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-charge-fee/create';
  public static readonly SETTING_CHARGE_FEE_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-charge-fee/update';
  public static readonly SETTING_CHARGE_FEE_FIND_ALL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-charge-fee/find-all';
  //Charge Fee
  public static readonly FIND_CHARGE_FEE = AcmURLConstants.CREDIT_SERVICE + '/charge-fees/';
  public static readonly CREATE_CHARGE_FEE = AcmURLConstants.CREDIT_SERVICE + '/charge-fees/create';
  public static readonly UPDATE_CHARGE_FEE = AcmURLConstants.CREDIT_SERVICE + '/charge-fees/update';
  public static readonly DELETE_CHARGE_FEE = AcmURLConstants.CREDIT_SERVICE + '/charge-fees/delete/';
  public static readonly CREATE_ALL_CHARGE_FEE = AcmURLConstants.CREDIT_SERVICE + '/charge-fees/create-all';

  // Setting_Acm_Environment
  public static readonly SETTING_ENVIRONMENT_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/find-all';
  public static readonly SETTING_ENVIRONMENT_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/update';
  public static readonly SETTING_ENVIRONMENT_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/create';
  public static readonly SETTING_ENVIRONMENT_FIND_BY_KEY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/';
  public static readonly SETTING_ENVIRONMENT_FIND_BY_KEYS = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/find-by-keys';
  // tslint:disable-next-line:max-line-length
  public static readonly SETTING_ENVIRONMENT_FIND_SETTING_ISCORE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/find-setting-iscore';
  public static readonly SETTING_ENVIRONMENT_LOAD_AML_DATA = AcmURLConstants.PARAMETRAGE_SERVICE + '/aml-settings/upload-aml-file';
  public static readonly SETTING_LOAD_AML_DATA_BY_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/aml-settings/';

  public static readonly SETTING_ENVIRONMENT_FIND_BY_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/find-by-category/';
  // SETTING LEVEL
  public static readonly FIND_ALL_LEVEL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level/find-all';
  public static readonly FIND_LEVEL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level/';
  public static readonly UPDATE_LEVEL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level/update';
  public static readonly CREATE_LEVEL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level/create';
  public static readonly UPDATE_ORDER_LEVEL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level/update-order';
  // SETTING LEVEL PROCESS
  public static readonly FIND_ALL_LEVEL_PROCESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level-process/find-setting';
  public static readonly UPDATE_LEVEL_PROCESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level-process/update';
  public static readonly CREATE_LEVEL_PROCESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level-process/create';
  public static readonly UPDATE_LEVEL_AMOUNT = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-level-process/update-amount';

  // SETTING NOTIFICATION
  public static readonly SETTING_NOTIFICATION_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-notifications/find-all';
  public static readonly SETTING_NOTIFICATION_FIND_CALENDAR_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-notifications/find-synchro-calendar-setting';
  public static readonly SETTING_NOTIFICATION_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-notifications/update';
  public static readonly SETTING_NOTIFICATION_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-notifications/create';
  public static readonly SETTING_CUSTOMER_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-client/find-all';
  public static readonly SETTING_CUSTOMER_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-client/update';


  // SETTING_HABILITATION_FIND_IHM_ROUTE
  public static readonly SETTING_HABILITATION_FIND_IHM_ROUTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/find-ihm-route';
  // SETTING_HABILITATION_USER_CREATE
  public static readonly SETTING_HABILITATION_USER_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/create';
  // SETTING_HABILITATION_FIND_ALL
  public static readonly SETTING_HABILITATION_FIND_ALL = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/find-all';
  public static readonly FIND_MAC = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/mac';
  // SETTING_SMS
  public static readonly FIND_SMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-sms/find';
  public static readonly SAVE_SMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-sms/save';
  public static readonly UPDATE_SMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-sms/update';
  // SETTING_HABILITATION_UPDATE
  public static readonly SETTING_HABILITATION_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/habilitations/update-all';
  public static readonly GET_ADDRESS_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-address-type';
  public static readonly GET_ADDRESS_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-settings-address';
  public static readonly GET_ADDRESS_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-address-list';
  public static readonly GET_ADDRESS_LIST_VALUE = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-address-list-value';
  public static readonly SAVE_SETTING_ADDRESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/add-settings-address';
  public static readonly UPDATE_SETTING_ADDRESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/update-settings-address';
  public static readonly DELETE_SETTING_ADDRESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/delete-settings-address';
  public static readonly GET_SETTING_ADDRESS_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-address-setting-list';
  public static readonly GET_ALL_ADDRESS_LIST_VALUE = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-all-address-list-value';
  public static readonly GET_ALL_ADDRESS_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/find-all-address-type';
  public static readonly DELETE_TYPE_ADDRESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/delete-type-address';
  public static readonly SAVE_SETTING_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-setting-list/save';
  public static readonly GET_SETTING_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-setting-list/';
  public static readonly SAVE_All_SETTING_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-setting-list/saveAll';


  // SETTING REQUIRED STEP
  public static readonly SETTING_REQUIRED_STEP_FIND_ALL = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-required-step/find-all';
  public static readonly SETTING_REQUIRED_STEP_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-required-step/';
  public static readonly SETTING_REQUIRED_STEP_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-required-step/update';
  public static readonly SETTING_REQUIRED_STEP_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-required-step/create';
  // SETTING JOURNAL ENTRY
  public static readonly SETTING_JOURNAL_ENTRY_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-entry/find-all';
  public static readonly SETTING_JOURNAL_ENTRY_FIND_BY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-entry/';
  public static readonly SETTING_JOURNAL_ENTRY_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-entry/create';
  public static readonly SETTING_JOURNAL_ENTRY_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-entry/update';
  public static readonly SETTING_JOURNAL_ENTRY_DELETE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-entry/delete/';
  public static readonly FIND_CREDIT_ACCOUNT_FROM_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/find_credit_acount';
  public static readonly SETTING_JOURNAL_ENTERIES_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-journal-enteries/save-all/';
  public static readonly FIND_JOURNALS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/find-journals';
  public static readonly FIND_APPLICATION_FEES = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-fees';
  public static readonly FIND_DETAILS_INFORMATIONS_LOAN_FROM_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/find-loan-Details-informations/';
  public static readonly FIND_Transition_ACCOUNT_FROM_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/transition-account/';
  public static readonly FIND_CUSTOMER_RECEIPTS_FROM_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/customer-receipt/';
  public static readonly FIND_CUSTOMER_Balance_FROM_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-abacus/balance_Customer/';
  public static readonly FIND_CUSTOMER_BALANCE_FROM_ACM = AcmURLConstants.CREDIT_SERVICE + '/customers/customer-balance/';
  // SETTING LIST VALUEs
  public static readonly BRANCHE_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-branches';
  public static readonly FIND_ASSET_TYPE_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-asset-list/'
  public static readonly FIND_PRODUCT_TYPE_LIST = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-product-list/'
  public static readonly GET_SETTING_LIST_VALUES = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-list-value/'

  // tslint:disable-next-line:max-line-length
  public static readonly LOAD_GUARANTOR_SOURCE = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-loan-guarantor-source';
  public static readonly LOAD_SOURCE_OF_FUNDS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-loan-source-funds';
  public static readonly LOAD_REFINANCE_REASON = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-loan-refinance-reason';
  // tslint:disable-next-line:max-line-length
  public static readonly LOAD_PRODUCT_LOAN_REASON = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-product-loan-leasons';
  public static readonly ROLES_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-roles-abacus';
  public static readonly RELATIONSHIPS_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-relationships';
  public static readonly INDUSTRY_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-industrys';
  public static readonly FIND_DEFERRED_PERIOD_TYPES = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-deferred-period-type';
  // UDF SETTING
  public static readonly FIND_UDF_GROUP = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-group-setting';
  public static readonly SAVE_UDF_GROUP = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-group-setting/save';
  public static readonly FIND_UDF_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-fields-setting';
  public static readonly SAVE_UDF_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-fields-setting/save';
  public static readonly FIND_UDF_LISTE_VALUE = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-list-value';
  public static readonly SAVE_UDF_LISTE_VALUE = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-list-value/save';
  public static readonly GET_UDF_GROUPES_BY_WORKFLOW_STEP = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-group-setting/find-workflow-step';
  public static readonly UPDATE_UDF_LINKS_BY_ELEMENT_ID = AcmURLConstants.CREDIT_SERVICE + '/udf-links/update-udf-links-by-elementId/';
  public static readonly FIND_MAX_INDEX_GROUP = AcmURLConstants.CREDIT_SERVICE + '/udf-links/find-max-index-group/';
  public static readonly DISABLE_UDF_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-fields-setting/disable';
  public static readonly DISABLE_UDF_LIST_VALUES = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/udf-list-value/disable';
  // UDF SETTING BY STEP WORKFLOW
  public static readonly FIND_UDF_GROUPS_BY_STEP_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/workflow_udf_groupe/find-udf-groups-by-step-id';
  public static readonly FIND_UDF_FIELDS_BY_STEP_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/workflow_udf_groupe/find-udf-fields-by-step-id/';

  // SATUS
  public static readonly FIND_STATUS_WORKFLOW = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-statut-workflows/find-all';
  // RESET CONFIG DATA
  public static readonly RESET_SETTING_UDF = AcmURLConstants.PARAMETRAGE_SERVICE + '/udf-settings/reset-setting';
  public static readonly RESET_SETTING_LIST_VALUS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/reset-setting';
  public static readonly RESET_SETTING_ADDRESS = AcmURLConstants.PARAMETRAGE_SERVICE + '/address-settings/reset-setting';
  public static readonly RELOAD_SETTING_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/reload-setting';
  public static readonly SAVE_CLIENT_IMAGE_IN_GED = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-client/save-client-image-to-ged';
  public static readonly FIND_PORTFOLIO_ABACUS = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/portfolio';
  public static readonly SYNC_IB_SETTING_AND_UDF = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/sync-ib-setting-and-udf'

  // SETTING FIELDS
  public static readonly FIND_IHM_FORMS_FOR_ROUTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-form/';
  public static readonly FIND_IHM_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-field/';
  public static readonly UPDATE_FIELD_HABILITATION = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-field-groupe/update/';
  public static readonly FIND_IHM_ROUTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/ihm-route/';
  public static readonly UPDATE_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-field/update';
  public static readonly FIND_IHM_VALIDATOR = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-validator/';
  public static readonly ADD_IHM_FORMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-form/create';
  public static readonly UPDATE_IHM_FORMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-form/update';
  public static readonly SAVE_ALL_FIELD = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-ihm-field/save-all';
  public static readonly DELETE_GENERATION_MEZA_CARD = AcmURLConstants.PARAMETRAGE_SERVICE + '/in-use-meza-cards/delete/';
  /**
   * EXPENSES-SERVICE
   */
  public static readonly FIND_ALL_EXPENSES_TYPES = AcmURLConstants.EXPENSES_SERVICE + '/expenses-type/';
  public static readonly ADD_EXPENSES_TYPES = AcmURLConstants.EXPENSES_SERVICE + '/expenses-type/create';
  public static readonly UPDATE_EXPENSES_TYPES = AcmURLConstants.EXPENSES_SERVICE + '/expenses-type/update';
  public static readonly DELETE_EXPENSES_TYPES = AcmURLConstants.EXPENSES_SERVICE + '/expenses-type/delete/';
  public static readonly SAVE_EXPENSES_LIMITS = AcmURLConstants.EXPENSES_SERVICE + '/expenses-limit/save';
  public static readonly FIND_EXPENSES_LIMITS = AcmURLConstants.EXPENSES_SERVICE + '/expenses-limit/';
  public static readonly FIND_ALL_EXPENSES = AcmURLConstants.EXPENSES_SERVICE + '/expenses/';
  public static readonly ADD_EXPENSES = AcmURLConstants.EXPENSES_SERVICE + '/expenses/create';
  public static readonly UPDATE_EXPENSES = AcmURLConstants.EXPENSES_SERVICE + '/expenses/update';
  public static readonly FIND_ALL_EXPENSES_PAGINATION = AcmURLConstants.EXPENSES_SERVICE + '/expenses/find-pagination';
  public static readonly FIND_EXPENSES_DOCUMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/find-expenses-document';
  public static readonly EXPENSES_COUNT = AcmURLConstants.EXPENSES_SERVICE + '/expenses/count';
  public static readonly EXPENSES_ACCOUNT_GL = AcmURLConstants.EXPENSES_SERVICE + '/expenses/find-account-list/';
  public static readonly REFRESH_EXPENSES_LIMITS = AcmURLConstants.EXPENSES_SERVICE + '/expenses-limit/refresh-limit-expenses';
  /**
   * INCENTIVE-SERVICE
   */
  public static readonly FIND_INCENTIVE_FREQUENCY = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/incentive-frequency';
  public static readonly FIND_INCENTIVE_TYPE = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/incentive-type';
  public static readonly FIND_REGISTRATION_CUSTOMER_TYPE = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/regestration-customer-type';
  public static readonly FIND_INCENTIVE_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/';
  public static readonly FIND_INCENTIVE_SETTING_CONSTANTS_BY_CATEGORIES = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-constant/find-by-categories';
  public static readonly CREATE_INCENTIVE_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/create';
  public static readonly UPDATE_INCENTIVE_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/update';
  public static readonly DELETE_INCENTIVE_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/delete/';
  public static readonly UPDTATE_STATUS_INCENTIVE_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/enable';
  public static readonly FIND_INCENTIVE_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-operation/';
  public static readonly FIND_ALL_INCENTIVE_RUN = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-run/';
  public static readonly CREATE_INCENTIVE_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-operation/create';
  public static readonly UPDATE_INCENTIVE_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-operation/update';
  public static readonly DELETE_INCENTIVE_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-operation/delete/';
  public static readonly FIND_PAGINATION_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-operation/find-pagination';
  public static readonly FIND_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/';
  public static readonly CREATE_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/create';
  public static readonly UPDATE_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/update';
  public static readonly DELETE_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting/delete/';
  public static readonly FIND_PAGINATION_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-registration/find-pagination';
  public static readonly PRODUCT_CATEGORY = AcmURLConstants.INCENTIVE_SERVICE + '/product-category/';
  public static readonly UPDTATE_STATUS_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-run/update-status';
  public static readonly FIND_STATUS_INCENTIVE_SETTING = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-run/find-by-code';
  public static readonly FIND_BRANCH_PRODUCTIVITY = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-prod-level/';
  public static readonly CREATE_BRANCH_PRODUCTIVITY = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-prod-level/create';
  public static readonly UPDATE_BRANCH_PRODUCTIVITY = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-prod-level/update';
  public static readonly DELETE_BRANCH_PRODUCTIVITY = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-prod-level/delete/';
  public static readonly FIND_PAGINATION_INCENTIVE_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-repayment/find-pagination';
  public static readonly CREATE_INCENTIVE_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-repayment/create';
  public static readonly UPDATE_INCENTIVE_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-repayment/update';
  public static readonly DELETE_INCENTIVE_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-repayment/delete/';
  public static readonly UPDATE_APPLY_DISCOUNT_BRANCH = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-setting-run/update-apply-discount-branch';
  public static readonly UPDATE_PRODUCT_CATEGORY = AcmURLConstants.INCENTIVE_SERVICE + '/product-category/update';
  public static readonly INCENTIVE_RUN_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-repayment/calculate';
  public static readonly INCENTIVE_GENERATE_REPORT_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-repayment/report-excel';
  public static readonly INCENTIVE_RUN_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-operation/calculate';
  public static readonly INCENTIVE_GENERATE_REPORT_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-operation/report-excel';
  public static readonly INCENTIVE_RUN_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-registration/calculate';
  public static readonly INCENTIVE_GENERATE_REPORT_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-registration/report-excel';
  public static readonly INCENTIVE_LOAD_RUN_YEAR_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-registration/get-run-year';
  public static readonly INCENTIVE_LOAD_RUN_MONTH_REGISTRATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-registration/get-run-month';
  public static readonly INCENTIVE_LOAD_RUN_YEAR_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-operation/get-run-year';
  public static readonly INCENTIVE_LOAD_RUN_MONTH_OPERATION = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-operation/get-run-month';
  public static readonly INCENTIVE_LOAD_RUN_YEAR_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-repayment/get-run-year';
  public static readonly INCENTIVE_LOAD_RUN_MONTH_REPAYMENT = AcmURLConstants.INCENTIVE_SERVICE + '/incentive-run-repayment/get-run-month';

  /**
   * RENEWAL_CONDITION_SETTINGS
   */
  public static readonly FIND_RENEWAL_CONDITION_SETTINGS = AcmURLConstants.PARAMETRAGE_SERVICE + '/renewal-condition/';
  public static readonly CREATE_RENEWAL_CONDITION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/renewal-condition/create';
  public static readonly UPDATE_RENEWAL_CONDITION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/renewal-condition/update';
  public static readonly DELETE_RENEWAL_CONDITION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/renewal-condition/delete/';
  public static readonly FIND_RENEWAL_CONDITION_SETTING_BY_CUSTOMER_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/renewal-condition/get-setting-renewal-condition';
  /**
   * Exception Request
   */
  public static readonly FIND_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/';
  public static readonly CREATE_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/save';
  public static readonly UPDATE_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/update';
  public static readonly FIND_PAGINATION_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/find-pagination';
  public static readonly UPDATE_STATUT_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/update-status';
  public static readonly COUNT_EXCEPTION_REQUEST = AcmURLConstants.CREDIT_SERVICE + '/exception-request/count-tabs';
  /**
   * COLLATERAL
   */
  public static readonly SAVE_COLATERAL = AcmURLConstants.CREDIT_SERVICE + '/acm-collateral/create-all';
  public static readonly FIND_COLATERAL_BY_LOAN = AcmURLConstants.CREDIT_SERVICE + '/acm-collateral/';
  public static readonly SAVE_UPDATE_DELETE_COLLATERAL = AcmURLConstants.CREDIT_SERVICE + '/acm-collateral/save-update-delete/';

  /**
   * SETTING COLLATERAL TYPES
   */
  public static readonly COLLATERAL_TYPES_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/settings-list-values/find-collateral-types';
  /**
   * Web Socket
   */
  public static readonly ADD_SESSION_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-notifications/save-session-id/';

  /**
   * group of connected user in AcmEnvironnement
   */
  public static readonly GROUP_OF_CONNECTED_USER_IN_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-environnements/check-authorisation-connected-user/';

  /**
   * COLLECTIONS
   */
  public static readonly FIND_COLLECTIONS_PAGINATIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/find-collection-pagination';
  public static readonly LOAD_FILTER_COLLECTION_BRANCH = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/load-filter-branch';
  public static readonly LOAD_FILTER_COLLECTION_STATUS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/load-filter-status';
  public static readonly LOAD_FILTER_COLLECTION_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/load-filter-product';
  public static readonly FIND_COLLECTIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/';
  public static readonly ACTION_COLLECTION_COMPLETED = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/complete-action';
  public static readonly ASSIGN_COLLECTION = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/assign-collection';
  public static readonly FIND_COLLECTION_STEP_BY_PARAMS = AcmURLConstants.PARAMETRAGE_SERVICE
    + '/setting-workflow/find-setting-collection';
  public static readonly UPDATE_COLLECTIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/update';
  public static readonly UPDATE_COLLECTIONS_INSTANCES = AcmURLConstants.PARAMETRAGE_SERVICE + '/collectionInstance/update';
  public static readonly SAVE_ALL_COLLECTIONS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/save-all/';
  public static readonly COLLECTION_REVIEWS = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection/collection-review';


  /**
   * Third party
   */

  public static readonly SETTING_THIRD_PARTY_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-third-party/create';
  public static readonly SETTING_THIRD_PARTY_PAGINATION = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-third-party/find-pagination';
  public static readonly SETTING_THIRD_PARTY_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-third-party/update';
  public static readonly SETTING_THIRD_PARTY_ENABLE = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-third-party/enable';
  public static readonly FIND_SETTING_THIRD_PARTY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-third-party/find-third-parties';

  /**
   * COLLECTION NOTES
   */
  public static readonly GET_COLLECTION_NOTES = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection-note/';
  public static readonly CREATE_COLLECTION_NOTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/collection-note/create';

  /**
   * WORKFLOW SERVICES
   */
  public static readonly SAVE_APPROVAL_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/save-approval-steps/';
  public static readonly SAVE_COLLECTION_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/save-collection-steps/';
  public static readonly FIND_APPROVAL_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/find';
  public static readonly FIND_COLLECTION_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/find-collection-steps';
  public static readonly FIND_WORKFLOW_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/find-workflow-steps';
  public static readonly UPLOAD_CSV_FILE_CHARGE_OFF = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-api-abacus/listDataCsvFile-charge-off';
  public static readonly FIND_INFORMATIONS_PAYMENT = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-api-abacus/get-informations-payment/';
  public static readonly PAYMENT_ACM_TO_ABACUS = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-api-abacus/payment-loan';
  public static readonly PAYMENT_LOAN_NOT_ISSUED = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-api-abacus/receipt-informations';
  public static readonly SAVING_DEPOSIT = AcmURLConstants.TRANSVERSE_SERVICE + '/load-data-api-abacus/saving-deposit/';
  public static readonly FIND_ACM_INFORMATIONS_PAYMENT = AcmURLConstants.CREDIT_SERVICE + '/acm-payment/get-payment-informations';
  public static readonly PAY = AcmURLConstants.CREDIT_SERVICE + '/acm-payment/pay';  
  public static readonly PAY_OUT = AcmURLConstants.CREDIT_SERVICE + '/acm-payment/pay-out';
  public static readonly FIND_ACM_TRANSACTION = AcmURLConstants.CREDIT_SERVICE + '/acm-transaction/find';
  public static readonly FIND_CUSTOMER_RECEIPTS_FROM_ACM = AcmURLConstants.CREDIT_SERVICE + '/acm-transaction/customer-receipt/';

  /**
    * Setting Topup
    */
  public static readonly GET_SETTING_TOPUP = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-topup/';
  public static readonly CREATE_SETTING_TOPUP = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-topup/create';
  public static readonly UPDATE_SETTING_TOPUP = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-topup/update';
  public static readonly CHECK_SETTING_TOPUP_VALIDITY_BY_LOAN = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-topup/check-validity';
  public static readonly VALIDATORS_GROUP_LOAN_INSTANCE = AcmURLConstants.CREDIT_SERVICE + '/acm-loanInstance-group-association/create';
  public static readonly LIST_VALIDATORS_GROUP_LOAN_INSTANCE = AcmURLConstants.CREDIT_SERVICE + '/acm-loanInstance-group-association/find-loanInstanceGroups';

  /**
  * Setting Product Eligibility
  */
  public static readonly GET_SETTING_PRODUCT_ELIGIBILITY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-eligibility/';
  public static readonly CREATE_SETTING_PRODUCT_ELIGIBILITY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-eligibility/create';
  public static readonly UPDATE_SETTING_PRODUCT_ELIGIBILITY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-eligibility/update';
  /**
  * Setting Product Eligibility
  */
  public static readonly GET_SETTING_PRODUCT_GUARANTEE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-guarantee/';
  public static readonly CREATE_SETTING_PRODUCT_GUARANTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-guarantee/save';
  public static readonly UPDATE_SETTING_PRODUCT_GUARANTE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-product-guarantee/update';


  /**
   * Conditonal approve
   */
  public static readonly CREATE_CONDITONAL_APPROVE = AcmURLConstants.CREDIT_SERVICE + '/conditionalApprove/create';
  public static readonly FIND_CONDITONAL_APPROVE_LOAN_ID = AcmURLConstants.CREDIT_SERVICE + '/conditionalApprove/find';
  public static readonly UPDATE_CONDITONAL_APPROVE = AcmURLConstants.CREDIT_SERVICE + '/conditionalApprove/update';
  public static readonly COUNT_CONDITONAL_APPROVE_LOAN_ID = AcmURLConstants.CREDIT_SERVICE + '/conditionalApprove/count/loan/';

  /**
   * Supplier
   */
  public static readonly CREATE_SUPPLIER = AcmURLConstants.CREDIT_SERVICE + '/supplier/create';
  public static readonly FIND_ALL_SUPPLIER = AcmURLConstants.CREDIT_SERVICE + '/supplier/find';
  public static readonly UPDATE_SUPPLIER = AcmURLConstants.CREDIT_SERVICE + '/supplier/update';
  public static readonly GET_SUPPLIER_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/supplier/find-pagination';
  public static readonly GET_SUPPLIER_BY_ID = AcmURLConstants.CREDIT_SERVICE + '/supplier/';
  public static readonly GET_ADDRESS_BY_ID_SUPPLIER = AcmURLConstants.CREDIT_SERVICE + '/supplier/address';
  public static readonly GET_LOANS_BY_SUPPLIER_ID = AcmURLConstants.CREDIT_SERVICE + '/loans/find-by-supplier/';
  public static readonly CREATE_ADDRESS = AcmURLConstants.CREDIT_SERVICE + '/supplier/address/create';
  /**
   * Convention
   */
  public static readonly CREATE_CONVENTION = AcmURLConstants.CREDIT_SERVICE + '/supplier/convention/create';
  public static readonly FIND_ALL_CONVENTION = AcmURLConstants.CREDIT_SERVICE + '/supplier/convention/find';
  public static readonly UPDATE_CONVENTION = AcmURLConstants.CREDIT_SERVICE + '/supplier/convention/update';
  public static readonly FIND_CONVENTION_BY_ID_SUPPLIER = AcmURLConstants.CREDIT_SERVICE + '/supplier/convention/findByIdSupplier/';

  /**
   * Asset
   */
  public static readonly CREATE_ASSET = AcmURLConstants.CREDIT_SERVICE + '/asset/create-all';
  public static readonly UPDATE_ASSET = AcmURLConstants.CREDIT_SERVICE + '/asset/update';
  public static readonly FIND_ASSET = AcmURLConstants.CREDIT_SERVICE + '/asset';
  public static readonly FIND_ASSET_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/asset/find-pagination';

  /**
   * UPLOAD asigned agreement
   */
  public static readonly GET_DOCUMENT_HISTORY = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/history/';

  public static readonly GET_DOCUMENT_HISTORY_BY_CUSTOMER = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/history/customer/';
  public static readonly GET_DOCUMENT_HISTORY_BY_COLLECTION_STEP = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/history/collectionStep/';
  public static readonly GET_DOCUMENT_HISTORY_BY_ITEM_STEP = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/history/itemStep/';

  public static readonly GET_DOCUMENT_HISTORY_BY_ELEMENT = AcmURLConstants.CREDIT_SERVICE + '/loans-documents/history/element/';



  /**
   * IB APIS
   */
  public static readonly GET_CUSTOMER_ADDRESS_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/address';
  public static readonly FIND_LOAN_INFORMATION_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/loans';
  public static readonly GET_CUSTOMER_DETAILS_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/customers';
  public static readonly GET_ALL_UDF_LINK_GROUP_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/udf-links/find-udf-groupby/';
  public static readonly GET_ALL_CUSTOMER_INFORMATION_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/customers/get-all-customer-information';
  public static readonly GET_DOCUMENT_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/get-document-and-save-in-ACM/';
  public static readonly DISPLAY_DOCUMENT_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/documents/display/';



  public static readonly CREATE_GENERIC_WORKFLOW_OBEJCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/generic-workflow-object/create';
  public static readonly FIND_GENERIC_WORKFLOW_OBEJCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/generic-workflow-object/findAll';
  //SETTING DYNAMIC PRODUCT
  public static readonly SETTING_DYNAMIC_PRODUCT_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-dynamic-product/create';
  public static readonly SETTING_DYNAMIC_PRODUCT_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-dynamic-product/find-pagination';


  //SETTING RISK TYPE
  public static readonly SETTING_RISK_TYPE_FIND = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/find-all';
  public static readonly SETTING_RISK_TYPE_FIND_ENABLED = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/find-by-enabled';
  public static readonly SETTING_RISK_TYPE_CREATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/create';
  public static readonly SETTING_RISK_TYPE_UPDATE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/update';
  public static readonly SETTING_RISK_TYPE_DELETE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/delete/';
  public static readonly SAVE_PRODUCT_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/save-product-steps';
  public static readonly FIND_PRODUCT_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/find-product-steps';
  public static readonly FIND_BY_PRODUCT_STEPS = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-workflow/find-by-product-steps/';
  public static readonly GET_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/find-loan-risks/';
  public static readonly SAVE_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-risk-type/save-loan-risks';
  public static readonly CREATE_PRODUCT = AcmURLConstants.PARAMETRAGE_SERVICE + '/products/create';
  //generic workFlow Document
  public static readonly GET_DOC_STEP = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/step/';

  public static readonly GET_DOC_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-document-types/category/';



  public static readonly CREATE_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/create';
  public static readonly FIND_PAGINATION_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/find-pagination';
  public static readonly FIND_ITEMS = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/find';
  public static readonly FIND_PAGINATION_UNASSIGNED_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/find-pagination-unassigned';

  public static readonly NEXT_STEP_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/nextStep';
  public static readonly REJECT_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/reject';
  public static readonly REVIEW_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/review';
  public static readonly ASSIGN_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/assignItem';
  public static readonly ITEM_BY_ID = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/findById/';
  public static readonly UPDATE_ITEM_INSTANCE = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-instance-generic-workflow/update';
  public static readonly UPDATE_ITEM = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-generic-workflow/update';




  public static readonly GET_ITEM_NOTES = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-note/';
  public static readonly CREATE_ITEM_NOTES = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-note/create';
  public static readonly FIND_STEP_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/step-risk/';
  public static readonly SAVE_STEP_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/step-risk/save';
  public static readonly FIND_INSTANCE_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-risk/';
  public static readonly SAVE_INSTANCE_RISK = AcmURLConstants.PARAMETRAGE_SERVICE + '/item-risk/save';

  public static readonly GENERIC_WF_BY_STEP = AcmURLConstants.PARAMETRAGE_SERVICE + '/genericWF/byStep/';













  public static readonly FIND_CLAIMS_FROM_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/claims';
  public static readonly UPDATE_CLAIMS_IN_IB = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/claims/update';
  public static readonly CLAIMS_FIND_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/load-data-ib/claims/find-pagination';



  /**
   * Credit Line
   */

  public static readonly CREATE_CREDIT_LINE = AcmURLConstants.CREDIT_SERVICE + '/credit-line/create';
  public static readonly CREDIT_LINE_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/credit-line/find-pagination';
  public static readonly DELETE_TOPPED_UP_HISTORY = AcmURLConstants.CREDIT_SERVICE + '/credit-line/delete-toppedup-history'
  public static readonly SYNC_CREDIT_LINE_ACCOUNTS = AcmURLConstants.PARAMETRAGE_SERVICE + '/batch-jobs/import-credit-line-accounts-job';
  public static readonly CREDIT_LINE_ACCOUNT_PAGINATION = AcmURLConstants.CREDIT_SERVICE + '/creditLineAccount/find-pagination';
  public static readonly CREDIT_LINE_ACCOUNT_REPORT_EXCEL = AcmURLConstants.CREDIT_SERVICE + '/creditLineAccount/credit-line-account-report-excel';
  public static readonly CREDIT_LINE_FIND_ALL = AcmURLConstants.CREDIT_SERVICE + '/credit-line/find-all';
  public static readonly CREDIT_LINE_ASSIGNMENT_PROCESS = AcmURLConstants.CREDIT_SERVICE + '/credit-line/assignment-process';
  public static readonly CREDIT_LINE_UNASSIGNMENT_PROCESS = AcmURLConstants.CREDIT_SERVICE + '/credit-line/un-assign-process';
  public static readonly CREDIT_LINE_UPLOAD_ASSIGNMENT_FILE = AcmURLConstants.CREDIT_SERVICE + '/credit-line/upload-assignment-file';
  public static readonly CREDIT_LINE_HISTORY_REPORT_EXCEL = AcmURLConstants.CREDIT_SERVICE + '/credit-line/credit-line-history-report-excel';
  public static readonly CREDIT_LINE_HISTORY_REPORT_PDF = AcmURLConstants.CREDIT_SERVICE + '/credit-line/credit-line-history-report-pdf';
  public static readonly CREDIT_LINE_SUMMARY_REPORT_EXCEL = AcmURLConstants.CREDIT_SERVICE + '/creditLineAccount/credit-line-summary-report-excel';
  public static readonly CREDIT_LINE_SUMMARY_REPORT_PDF = AcmURLConstants.CREDIT_SERVICE + '/creditLineAccount/credit-line-summary-report-pdf';


  /**
   * User Screen Preferences
   */
  public static readonly FIND_USER_SCREEN_PREFERENCES = AcmURLConstants.PARAMETRAGE_SERVICE + '/user-screen-preferences/find';
  public static readonly SAVE_USER_SCREEN_PREFERENCES = AcmURLConstants.PARAMETRAGE_SERVICE + '/user-screen-preferences/save';

  /**
   * AML List setting
   */
  public static readonly FIND_AML_LIST_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/aml-list-setting/find';
  public static readonly SAVE_AML_LIST_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/aml-list-setting/save';

  /**
   * Doubtful Tx Setting
   */
  public static readonly FIND_DOUBTFUL_TRANSACTION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/doubtful-transaction-setting/find';
  public static readonly SAVE_DOUBTFUL_TRANSACTION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/doubtful-transaction-setting/save';
  public static readonly DISABLE_DOUBTFUL_TRANSACTION_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/doubtful-transaction-setting/disable';

  /**
   * KYC CHECK
   */
  public static readonly SAVE_KYC_CHECK = AcmURLConstants.AML_SERVICE + '/kyc-check/save';
  public static readonly FIND_KYC_CHECK = AcmURLConstants.AML_SERVICE + '/kyc-check/find';

  /**
   * SCORE CHECK
   */
  public static readonly SAVE_SCORE_CHECK = AcmURLConstants.AML_SERVICE + '/score-check/save';
  public static readonly FIND_SCORE_CHECK = AcmURLConstants.AML_SERVICE + '/score-check/find';

  /**
   * Balcklist
   */
  public static readonly FIND_SETTING_BLACKLIST_PARTY_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-blacklist-party-type/';
  public static readonly SAVE_SETTING_BLACKLIST_PARTY_TYPE = AcmURLConstants.PARAMETRAGE_SERVICE + '/setting-blacklist-party-type/save';

  public static readonly SAVE_BLACKLIST_ITEM = AcmURLConstants.AML_SERVICE + '/blacklist/save-item';
  public static readonly SAVE_BLACKLIST_ITEMS = AcmURLConstants.AML_SERVICE + '/blacklist/save-items';
  public static readonly FIND_BLACKLIST_ITEMS = AcmURLConstants.AML_SERVICE + '/blacklist/find-pagination';
  public static readonly UPLOAD_BLACKLIST_ITEMS_FILE = AcmURLConstants.AML_SERVICE + '/blacklist/upload-items-file';

  /**
   * Currency setting
   */
  public static readonly SAVE_CURRENCY_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-currency-setting/save';
  public static readonly FIND_CURRENCY_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-currency-setting/find';

  /**
   * Closed days setting
   */
  public static readonly SAVE_CLOSED_DAYS_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-closed-days-setting/save';
  public static readonly FIND_CLOSED_DAYS_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-closed-days-setting/find';


  /**
   * Holiday setting
   */
  public static readonly SAVE_HOLIDAY_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-holidays-setting/save';
  public static readonly FIND_HOLIDAY_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-holidays-setting/find';

  /**
   * Branch Setting
   */
  public static readonly SAVE_BRANCH_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-branches/save';
  public static readonly FIND_BRANCH_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-branches/find';

  /**
   * Financial Category
   */
  public static readonly SAVE_FINANCIAL_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-financial-category/save';
  public static readonly FIND_PAGINATION_FINANCIAL_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-financial-category/find-pagination';
  public static readonly FIND_FINANCIAL_CATEGORY = AcmURLConstants.PARAMETRAGE_SERVICE + '/acm-financial-category/find';

  /**
   * GL Account
   */
  public static readonly SAVE_GL_ACCOUNT = AcmURLConstants.PARAMETRAGE_SERVICE + '/gl-account/save';
  public static readonly FIND_GL_ACCOUNT = AcmURLConstants.PARAMETRAGE_SERVICE + '/gl-account/find';
  public static readonly FIND_PAGINATION_GL_ACCOUNT = AcmURLConstants.PARAMETRAGE_SERVICE + '/gl-account/find-pagination';

  /**
   * ACM Journal
   */
  public static readonly FIND_PAGINATION_ACM_JOURNAL = AcmURLConstants.CREDIT_SERVICE + '/acm-journal/find-pagination';
  public static readonly GENERATE_ACM_JOURNAL_EXCEL_REPORT = AcmURLConstants.CREDIT_SERVICE + '/acm-journal/report-excel';

  /**
   * Reporting Setting 
   */
  public static readonly SAVE_REPORTING_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/reporting-setting/save';
  public static readonly FIND_REPORTING_SETTING = AcmURLConstants.PARAMETRAGE_SERVICE + '/reporting-setting/find';
  public static readonly GENERATE_EXCEL_REPORT = AcmURLConstants.PARAMETRAGE_SERVICE + '/reporting-setting/generate-excel-report';
  public static readonly GENERATE_PDF_REPORT = AcmURLConstants.PARAMETRAGE_SERVICE + '/reporting-setting/generate-pdf-report';
  public static readonly FIND_REPORT_DATA = AcmURLConstants.PARAMETRAGE_SERVICE + '/reporting-setting/find-report-data';
}

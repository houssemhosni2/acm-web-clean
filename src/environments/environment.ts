// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  authentificationUserName: 'talysclient',
  authentificationPassword: 'appclient@123',

  /*
   * LocalHost
   */
  oauthUrl: 'http://localhost:8080/',
  apiUrl: 'http://localhost:8080/', 
  // webSocketEndPoint: 'http://localhost:8091/stomp',

  /*
   * Integration (BRJMF)
   */
  // oauthUrl: 'http://172.16.4.102:8080/',
  // apiUrl: 'http://172.16.4.102:8080/',
  // webSocketEndPoint: 'http://172.16.4.102:8091/stomp',
  /*
   * Recette (Tamkeen V13)
   */
  //  oauthUrl: 'http://172.16.4.104:8080/',
  //  apiUrl: 'http://172.16.4.104:8080/',
  //  webSocketEndPoint: 'http://172.16.4.104:8091/stomp',

  /*
   * Tamkeen UAT
   */
  //oauthUrl: 'http://172.16.30.4:8080/',
  //oauthUrl: 'https://acm.alahlytamkeen.net/AuthServ/',
  //apiUrl: 'http://172.16.30.4:8080/',
  //apiUrl: 'https://acm.alahlytamkeen.net/ApiServ/',

  /*
  * UAT (SANAD V13)
  */
  // oauthUrl: 'http://10.0.0.252:8080/',
  // apiUrl: 'http://10.0.0.252:8080/',
  // webSocketEndPoint: 'http://10.0.0.252:8091/stomp',

  /*
  * Recette (Zitouna V13.2)
  */
 // oauthUrl: 'http://172.16.4.108:8080/',
 // apiUrl: 'http://172.16.4.108:8080/',
  // webSocketEndPoint: 'http://172.16.4.108:8091/stomp',

  /*
   * Tamkeen UAT/IB Server
   */
  // oauthUrl: 'http://192.168.40.3:8080/',
  // apiUrl: 'http://192.168.40.3:8080/',

  /*
   * Recette (Demo)
   */

  // oauthUrl: 'http://172.16.4.110:8080/',
  // apiUrl: 'http://172.16.4.110:8080/',
  // webSocketEndPoint: 'http://172.16.4.110:8091/stomp',

  /*
   * Recette (Zitouna V13.1)
   */
  //  oauthUrl: 'http://172.16.4.34:8080/',
  //  apiUrl: 'http://172.16.4.34:8080/',
  // webSocketEndPoint: 'http://172.16.4.108:8091/stomp',
   /*
   * Recette (Zitouna V13.1)
   */
  //  oauthUrl: 'http://172.16.4.43:8080/',
  //  apiUrl: 'http://172.16.4.43:8080/',
  // webSocketEndPoint: 'http://172.16.4.108:8091/stomp',

  production: false,
};

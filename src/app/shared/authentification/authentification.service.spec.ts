import { TestBed } from '@angular/core/testing';

import { AuthentificationService } from './authentification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('AuthentificationService', () => {
  let authentificationService: AuthentificationService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthentificationService
      ],
    });

    authentificationService = TestBed.get(AuthentificationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const auth: AuthentificationService = TestBed.get(AuthentificationService);
    expect(auth).toBeTruthy();
  });

  it('should login ', () => {
    // preparing the mocked result
    const username = 'admin';
    const password = 'admin';
    // const data = 'grant_type=password&username=' + username + '&password=' + password;
    // const url = environment.apiUrl + 'oauth/token?' + data;
    let reqHeader = new HttpHeaders();
    reqHeader = reqHeader.append('Authorization', 'Basic '
      + btoa('authentificationUserName' + ':' + 'authentificationPassword'));
    // subscribe to the service
    authentificationService.login(username, password).subscribe((result: any) => {
      expect(reqHeader).toEqual(result.headers);
    });
    // expect exactly one request that matches
    const req = httpMock.expectOne(request => {
      return true;
    });
    // expect that the request methode is an GET
    expect(req.request.method).toBe('POST');
    // expect that the response type is JSON
    expect(req.request.responseType).toEqual('json');
    // The flush method completes the request using the data passed to it
  });

  it('should logout ', () => {
    // preparing the mocked result
    // const url = environment.apiUrl + 'oauth/token?' + 'users/logOut';
    // subscribe to the service
    authentificationService.logout().subscribe();
    // expect exactly one request that matches
    const req = httpMock.expectOne(request => {
      return true;
    });
    // expect that the request methode is an GET
    expect(req.request.method).toBe('GET');
    // expect that the response type is JSON
    expect(req.request.responseType).toEqual('json');
    // The flush method completes the request using the data passed to it
  });
});

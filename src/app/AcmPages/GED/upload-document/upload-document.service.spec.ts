import {TestBed} from '@angular/core/testing';

import {UploadDocumentService} from './upload-document.service';

describe('UploadDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadDocumentService = TestBed.get(UploadDocumentService);
    expect(service).toBeTruthy();
  });
});

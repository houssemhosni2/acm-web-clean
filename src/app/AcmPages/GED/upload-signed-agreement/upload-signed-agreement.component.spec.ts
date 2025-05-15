import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UploadSignedAgreementComponent} from './upload-signed-agreement.component';

describe('UploadSignedAgreementComponent', () => {
  let component: UploadSignedAgreementComponent;
  let fixture: ComponentFixture<UploadSignedAgreementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadSignedAgreementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSignedAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

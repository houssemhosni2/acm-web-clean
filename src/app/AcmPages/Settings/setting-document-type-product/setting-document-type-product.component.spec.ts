import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingDocumentTypeProductComponent } from './setting-document-type-product.component';

describe('SettingDocumentTypeProductComponent', () => {
  let component: SettingDocumentTypeProductComponent;
  let fixture: ComponentFixture<SettingDocumentTypeProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingDocumentTypeProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDocumentTypeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

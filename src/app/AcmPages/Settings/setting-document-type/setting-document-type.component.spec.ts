import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingDocumentTypeComponent } from './setting-document-type.component';

describe('SettingDocumentTypeComponent', () => {
  let component: SettingDocumentTypeComponent;
  let fixture: ComponentFixture<SettingDocumentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

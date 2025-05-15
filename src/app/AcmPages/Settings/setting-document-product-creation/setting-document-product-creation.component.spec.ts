import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDocumentProductCreationComponent } from './setting-document-product-creation.component';

describe('SettingDocumentProductCreationComponent', () => {
  let component: SettingDocumentProductCreationComponent;
  let fixture: ComponentFixture<SettingDocumentProductCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingDocumentProductCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDocumentProductCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

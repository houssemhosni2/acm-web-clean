import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingProductGeneralConfigComponent } from './setting-product-general-configuration.component';

describe('SettingProductConfigurationComponent', () => {
  let component: SettingProductGeneralConfigComponent;
  let fixture: ComponentFixture<SettingProductGeneralConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingProductGeneralConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingProductGeneralConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

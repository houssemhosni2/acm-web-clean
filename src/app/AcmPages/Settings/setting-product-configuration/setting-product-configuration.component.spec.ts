import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingProductConfigurationComponent } from './setting-product-configuration.component';

describe('SettingProductConfigurationComponent', () => {
  let component: SettingProductConfigurationComponent;
  let fixture: ComponentFixture<SettingProductConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingProductConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingProductConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

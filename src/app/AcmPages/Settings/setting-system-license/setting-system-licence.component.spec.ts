import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSystemLicenceComponent } from './setting-system-licence.component';

describe('SettingSystemLicenceComponent', () => {
  let component: SettingSystemLicenceComponent;
  let fixture: ComponentFixture<SettingSystemLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingSystemLicenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSystemLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAddressComponent } from './setting-address.component';

describe('SettingAddressComponent', () => {
  let component: SettingAddressComponent;
  let fixture: ComponentFixture<SettingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

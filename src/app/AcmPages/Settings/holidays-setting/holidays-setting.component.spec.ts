import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysSettingComponent } from './holidays-setting.component';

describe('HolidaysSettingComponent', () => {
  let component: HolidaysSettingComponent;
  let fixture: ComponentFixture<HolidaysSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaysSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

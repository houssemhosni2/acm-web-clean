import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedDaysSettingComponent } from './closed-days-setting.component';

describe('ClosedDaysSettingComponent', () => {
  let component: ClosedDaysSettingComponent;
  let fixture: ComponentFixture<ClosedDaysSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedDaysSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedDaysSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
